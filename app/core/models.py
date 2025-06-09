from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()




class Task(models.Model):

    status_choices = [
        ('Nowy', 'Nowy'),
        ('W toku', 'W toku'),
        ('Rozwiązany', 'Rozwiązany'),
    ]
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    status = models.CharField(choices=status_choices, default="Nowy")
    assigned_user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_tasks'
    )


    def __str__(self):
        return f"{self.name} (status: {self.status})"