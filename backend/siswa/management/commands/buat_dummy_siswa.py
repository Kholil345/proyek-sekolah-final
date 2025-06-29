# siswa/management/commands/buat_dummy_siswa.py

from django.core.management.base import BaseCommand
from siswa.models import Siswa
from django.core.files.base import ContentFile
from faker import Faker
import random

class Command(BaseCommand):
    help = 'Membuat 20 data dummy siswa'

    def handle(self, *args, **kwargs):
        fake = Faker()

        for i in range(20):
            siswa = Siswa(
                nama_lengkap=fake.name(),
                nisn=str(fake.random_number(digits=10)),
                tempat_lahir=fake.city(),
                tanggal_lahir=fake.date_of_birth(minimum_age=13, maximum_age=16),
                nik=str(fake.random_number(digits=16)),
                jenis_kelamin=random.choice(['L', 'P']),
                alamat=fake.address(),
                no_telepon=fake.phone_number(),
                asal_sekolah=fake.company(),
                alamat_asal_sekolah=fake.address(),
                nama_ayah=fake.name_male(),
                nama_ibu=fake.name_female(),
                no_telepon_ortu=fake.phone_number(),
            )

            dummy_file = ContentFile(b'This is a dummy document.', name='dummy.pdf')
            siswa.dok_kk = dummy_file
            siswa.dok_akte = dummy_file
            siswa.dok_ijazah = dummy_file
            siswa.dok_ktp_ortu = dummy_file
            siswa.dok_kip = dummy_file
            siswa.save()

        self.stdout.write(self.style.SUCCESS('✅ 20 data dummy siswa berhasil dibuat'))
