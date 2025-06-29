# pengaturan/models.py

from django.db import models

class PengaturanPendaftaran(models.Model):
    is_open = models.BooleanField(default=False, help_text="Aktifkan untuk membuka pendaftaran siswa baru")
    
    # Untuk memastikan hanya ada satu object pengaturan
    def save(self, *args, **kwargs):
        self.pk = 1
        super(PengaturanPendaftaran, self).save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        pass # Mencegah penghapusan

    @classmethod
    def load(cls):
        # Membuat object jika belum ada, atau mengambil yang sudah ada
        obj, created = cls.objects.get_or_create(pk=1)
        return obj

    def __str__(self):
        return "Pengaturan Pendaftaran"