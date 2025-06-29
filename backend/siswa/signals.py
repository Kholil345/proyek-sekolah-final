# siswa/signals.py

from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import Siswa
from notifikasi.models import Notifikasi # <-- Import model Notifikasi

@receiver(post_save, sender=Siswa)
def send_new_student_notification(sender, instance, created, **kwargs):
    # Kirim notifikasi hanya jika siswa baru dibuat DAN statusnya 'BARU'
    if created and instance.status == 'BARU':
        # Ambil semua user yang merupakan staf/admin
        admins = User.objects.filter(is_staff=True)
        
        title = "Pendaftar Baru!"
        content = f"Siswa baru bernama {instance.nama_lengkap} telah mendaftar."
        
        # Buat notifikasi untuk setiap admin
        for admin in admins:
            Notifikasi.objects.create(user=admin, title=title, content=content)
        
        print(f"✔️ Notifikasi dibuat untuk {admins.count()} admin.")