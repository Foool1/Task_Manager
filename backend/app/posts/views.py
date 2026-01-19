from rest_framework import viewsets, filters, generics, mixins
from core.models import Post, Comment
from .serializers import PostHistorySerializer
from .serializers import PostSerializer, RegisterUserSerializer, SimpleUserSerializer, CommentSerializer
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly, SAFE_METHODS, BasePermission
from django.shortcuts import render
from rest_framework.decorators import action
from rest_framework.response import Response


class IsSuperuserOrReadOnly(BasePermission):
    """
    Tylko superuser może tworzyć / modyfikować / usuwać.
    Czytanie (GET, HEAD, OPTIONS) dla wszystkich.
    """
    def has_permission(self, request, view):
        # SAFE_METHODS → GET, HEAD, OPTIONS → każdy
        if request.method in SAFE_METHODS:
            return True
        # reszta (POST, PUT, PATCH, DELETE) → tylko superuser
        return request.user and request.user.is_superuser


class IsAuthenticatedOrReadOnly(BasePermission):
    # ← już znasz, ale dla kompletności
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated


class AllowOptions(IsAuthenticated):
    def has_permission(self, request, view):
        if request.method == "OPTIONS":
            return True
        return super().has_permission(request, view)


class RegisterUserView(mixins.CreateModelMixin,
                          viewsets.GenericViewSet):
    queryset = User.objects.all()
    serializer_class = RegisterUserSerializer
    permission_classes = [AllowAny]


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = SimpleUserSerializer
    permission_classes = [AllowOptions]  # ← zostaje, bo chcemy tylko zalogowanych

    @action(detail=False, methods=['get'], url_path='me')
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer
    permission_classes = [IsSuperuserOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, DjangoFilterBackend]
    filterset_fields = ['id', 'status', 'przypisany_uzytkownik']
    search_fields = ['nazwa', 'opis']

    def perform_create(self, serializer):
        serializer.save(przypisany_uzytkownik=self.request.user)


class PostHistoryListView(generics.ListAPIView):
    serializer_class = PostHistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        post_id = self.kwargs['pk']
        return Post.history.filter(id=post_id)


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['post']

    def get_queryset(self):
        """
        Opcjonalnie ograniczamy listę komentarzy tylko do tych należących do danego posta,
        kiedy ktoś wejdzie na /api/posts/5/comments/
        """
        if 'post_pk' in self.kwargs:
            return Comment.objects.filter(post_id=self.kwargs['post_pk'])
        return Comment.objects.all()

    def perform_create(self, serializer):
        """
        Automatycznie przypisujemy autora = zalogowany użytkownik
        """
        serializer.save(author=self.request.user)

    def check_object_permissions(self, request, obj):
        if self.action in ['update', 'partial_update', 'destroy']:
            if obj.author != request.user and not request.user.is_superuser:
                self.permission_denied(request)
        super().check_object_permissions(request, obj)


class PostCommentsViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Comment.objects.filter(post_id=self.kwargs['post_pk']).order_by('created_at')