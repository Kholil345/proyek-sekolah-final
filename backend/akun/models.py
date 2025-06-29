# akun/models.py

from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    # Definisikan pilihan untuk peran/status
    ROLE_CHOICES = (
        ('ADMIN', 'Administrator'),
        ('BENDAHARA', 'Bendahara'),
        ('KEPALA_SEKOLAH', 'Kepala Sekolah'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    foto_profil = models.ImageField(upload_to='foto_profil_admin/', null=True, blank=True, default='foto_profil_admin/default.jpg')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='ADMIN')

    def __str__(self):
        return f'{self.user.username} Profile'

    @property
    def nama_lengkap(self):
        return self.user.get_full_name()
    
    @property
    def foto_profil_url(self):
        try:
            url = self.foto_profil.url
        except (ValueError, AttributeError):
            url = ''
        return url