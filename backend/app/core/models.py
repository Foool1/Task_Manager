from django.db import models
from django.contrib.auth.models import User
from simple_history.models import HistoricalRecords


class Post(models.Model):

    status_choices = [
        ('Nowy', 'Nowy'),
        ('W toku', 'W toku'),
        ('Rozwiązany', 'Rozwiązany'),
    ]
    nazwa = models.CharField(max_length=255)
    opis = models.TextField(blank=True, null=True)
    status = models.CharField(choices=status_choices, default="Nowy")
    przypisany_uzytkownik = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    image = models.ImageField(upload_to='post_images/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    history = HistoricalRecords()

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Ticket"
        verbose_name_plural = "Tickety"

    def __str__(self):
        return self.nazwa


class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    history = HistoricalRecords()

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"Komentarz {self.author} do {self.post.nazwa[:30]}"