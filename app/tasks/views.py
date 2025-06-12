from rest_framework import viewsets, filters, generics, mixins
from core.models import Task
from .serializers import TaskHistorySerializer
from .serializers import TaskSerializer, RegisterUserSerializer, SimpleUserSerializer
from .permissions import IsOwnerOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.shortcuts import render


class RegisterUserView(mixins.CreateModelMixin,
                          viewsets.GenericViewSet):
    queryset = User.objects.all()
    serializer_class = RegisterUserSerializer
    permission_classes = [AllowAny]


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = SimpleUserSerializer
    permission_classes = [IsAuthenticated]


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, DjangoFilterBackend]
    filterset_fields = ['id', 'status', 'przypisany_uzytkownik']
    search_fields = ['nazwa', 'opis']


    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Task.objects.all().order_by('id')
        return Task.objects.filter(przypisany_uzytkownik=user).order_by('id')

    def perform_create(self, serializer):
        serializer.save(przypisany_uzytkownik=self.request.user)


class TaskHistoryListView(generics.ListAPIView):
    serializer_class = TaskHistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        task_id = self.kwargs['pk']
        return Task.history.filter(id=task_id)