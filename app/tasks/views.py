from rest_framework import viewsets, filters, generics, mixins
from core.models import Task
from .serializers import TaskSerializer, RegisterUserSerializer, SimpleUserSerializer
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.shortcuts import render


def main_page_view(request):
    return render(request, 'main.html')

def login_page_view(request):
    return render(request, 'login.html')

def register_page_view(request):
    return render(request, 'register.html')

def create_task_page_view(request):
    return render(request, 'create_task.html')

def task_page_view(request):
    return render(request, 'tasks.html')

def edit_task_page_view(request):
    return render(request, 'edit_task.html')

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
    queryset = Task.objects.all().order_by('id')
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, DjangoFilterBackend]
    filterset_fields = ['id', 'status', 'przypisany_uzytkownik']
    search_fields = ['nazwa', 'opis']