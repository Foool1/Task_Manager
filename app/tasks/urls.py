from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, UserViewSet, RegisterUserView

router = DefaultRouter()
router.register(r'register', RegisterUserView, basename='register')
router.register(r'users', UserViewSet, basename='user')
router.register(r'tasks', TaskViewSet, basename='task')

urlpatterns = router.urls
