"""app URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)

from rest_framework.authtoken.views import obtain_auth_token
from tasks.views import (
    TaskViewSet,
    RegisterUserView,
    main_page_view,
    login_page_view,
    register_page_view,
    create_task_page_view,
    task_page_view,
    edit_task_page_view,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/login/', obtain_auth_token, name='login'),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    path('api/', include('tasks.urls')),
    path('', main_page_view, name='main'),
    path('login/', login_page_view, name='login'),
    path('tasks/', task_page_view, name='tasks'),
    path('register/', register_page_view, name='register'),
    path('create_task/', create_task_page_view, name='create_task'),
    path('edit_task/', edit_task_page_view, name='edit_task'),
]
