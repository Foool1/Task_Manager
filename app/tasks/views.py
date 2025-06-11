from rest_framework import viewsets, filters, generics
from core.models import Task
from .serializers import TaskSerializer, RegisterUserSerializer
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny
from django.shortcuts import render


def tasks_page_view(request):
    return render(request, 'tasks.html')

def login_page_view(request):
    return render(request, 'login.html')

def register_page_view(request):
    return render(request, 'register.html')

class RegisterUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterUserSerializer
    permission_classes = [AllowAny]



class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all().order_by('id')
    serializer_class = TaskSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, DjangoFilterBackend]
    filterset_fields = ['id', 'status', 'przypisany_uzytkownik']
    search_fields = ['nazwa', 'opis']