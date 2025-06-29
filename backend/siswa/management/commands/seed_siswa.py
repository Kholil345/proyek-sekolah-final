# siswa/management/commands/seed_siswa.py

import random
from django.core.management.base import BaseCommand
from faker import Faker
from siswa.models import Siswa

class Command(BaseCommand):
    help = 'Membuat data siswa dummy dalam jumlah banyak'

    def add_arguments(self, parser):
        # Menambahkan argumen opsional untuk menentukan jumlah data
        parser.add_argument('--count', type=int, help='Jumlah siswa dummy yang akan dibuat', default=1)

    def handle(self, *args, **options):
        count = options['count']
        fake = Faker('id_ID') # Menggunakan Faker dengan lokal Indonesia

        self.stdout.write(self.style.SUCCESS(f"Membuat {count} data siswa dummy..."))

        for i in range(count):
            # Pilih kelas secara acak
            kelas_choice = random.choice(['X', 'XI', 'XII'])
            
            # Buat nama depan dan belakang
            first_name = fake.first_name()
            last_name = fake.last_name()
            full_name = f"{first_name} {last_name}"

            # Buat objek Siswa baru
            Siswa.objects.create(
                nama_lengkap=full_name,
                nisn=fake.unique.numerify(text='##########'),
                tempat_lahir=fake.city(),
                tanggal_lahir=fake.date_of_birth(minimum_age=15, maximum_age=18),
                nik=fake.unique.numerify(text='################'),
                jenis_kelamin=random.choice(['L', 'P']),
                alamat=fake.address(),
                no_telepon=fake.phone_number(),
                asal_sekolah=f"SMP Negeri {random.randint(1, 50)} {fake.city()}",
                alamat_asal_sekolah=fake.address(),
                nama_ayah=f"{fake.first_name_male()} {fake.last_name()}",
                nama_ibu=f"{fake.first_name_female()} {fake.last_name()}",
                no_telepon_ortu=fake.phone_number(),
                kelas=kelas_choice,
                status='BARU', # Otomatis statusnya 'Murid Baru'
            )
            self.stdout.write(f"Siswa '{full_name}' berhasil dibuat. ({i + 1}/{count})")

        self.stdout.write(self.style.SUCCESS(f"SELESAI! {count} data siswa dummy telah berhasil dibuat."))