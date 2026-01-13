from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import PostViewSet, UserViewSet, RegisterUserView, CommentViewSet, PostCommentsViewSet

router = DefaultRouter()
router.register(r'register', RegisterUserView, basename='register')
router.register(r'users', UserViewSet, basename='user')
router.register(r'posts', PostViewSet, basename='post')
router.register(r'comments', CommentViewSet, basename='comments')

post_comments_router = DefaultRouter()
post_comments_router.register(r'comments', PostCommentsViewSet, basename='post-comments')

urlpatterns = router.urls
