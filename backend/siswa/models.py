from django.db import models

class Siswa(models.Model):
    JENIS_KELAMIN_CHOICES = (
        ('L', 'Laki-laki'),
        ('P', 'Perempuan'),
    )

    KELAS_CHOICES = (
        ('X', 'Kelas X'),
        ('XI', 'Kelas XI'),
        ('XII', 'Kelas XII'),
    )

    STATUS_CHOICES = (
        ('BARU', 'Murid Baru'),
        ('AKTIF', 'Aktif'),
        ('LULUS', 'Lulus'),
        ('PINDAH', 'Pindah'),
        ('DROPOUT', 'Drop Out'),
    )

    
    created_at = models.DateTimeField(auto_now_add=True)
    nama_lengkap = models.CharField(max_length=255)
    nisn = models.CharField(max_length=20)
    tempat_lahir = models.CharField(max_length=100)
    tanggal_lahir = models.DateField()
    nik = models.CharField(max_length=20)
    jenis_kelamin = models.CharField(max_length=1, choices=JENIS_KELAMIN_CHOICES)
    alamat = models.TextField()
    no_telepon = models.CharField(max_length=20)
    asal_sekolah = models.CharField(max_length=255)
    alamat_asal_sekolah = models.TextField()
    nama_ayah = models.CharField(max_length=255)
    nama_ibu = models.CharField(max_length=255)
    no_telepon_ortu = models.CharField(max_length=20)
    kelas = models.CharField(max_length=5, choices=KELAS_CHOICES, default='X')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='BARU')
    foto_profil = models.ImageField(upload_to='foto_profil/', blank=True, null=True)

    dok_kk = models.FileField(upload_to='dokumen/kk/', blank=True, null=True)
    dok_akte = models.FileField(upload_to='dokumen/akte/', blank=True, null=True)
    dok_ijazah = models.FileField(upload_to='dokumen/ijazah/', blank=True, null=True)
    dok_ktp_ortu = models.FileField(upload_to='dokumen/ktp_ortu/', blank=True, null=True)
    dok_kip = models.FileField(upload_to='dokumen/kip/', blank=True, null=True)

    def __str__(self):
        return self.nama_lengkap
