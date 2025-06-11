from django.db import models
from django.contrib.auth.models import User


class Task(models.Model):

    status_choices = [
        ('Nowy', 'Nowy'),
        ('W toku', 'W toku'),
        ('Rozwiązany', 'Rozwiązany'),
    ]
    nazwa = models.CharField(max_length=255)
    opis = models.TextField(blank=True, null=True)
    status = models.CharField(choices=status_choices, default="Nowy")
    przypisany_uzytkownik = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.nazwa
