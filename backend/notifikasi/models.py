# notifikasi/models.py

from django.db import models
from django.contrib.auth.models import User

class Notifikasi(models.Model):
    # Notifikasi ini ditujukan untuk user siapa
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    
    # Isi notifikasi
    title = models.CharField(max_length=255)
    content = models.TextField()
    
    # Status notifikasi
    is_read = models.BooleanField(default=False)
    
    # Timestamp
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notifikasi untuk {self.user.username}: {self.title}"

    class Meta:
        # Urutkan dari yang paling baru
        ordering = ['-timestamp']