from django.contrib import admin
from .models import Post, Comment


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'nazwa',
        'status',
        'przypisany_uzytkownik',
        'created_at',
    )
    search_fields = ('nazwa', 'opis')
    list_filter = ('status', 'created_at')
    ordering = ('-created_at',)


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('id', 'post', 'author', 'created_at')
    search_fields = ('content',)
