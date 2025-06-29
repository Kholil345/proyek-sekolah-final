# siswa/views.py

from rest_framework import viewsets, filters, status
from django_filters.rest_framework import DjangoFilterBackend
from .models import Siswa
from .serializers import SiswaSerializer
from rest_framework.response import Response
# [FIX 1] Impor dekorator dan kelas izin yang diperlukan
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Count, Q
from django.utils import timezone
from datetime import datetime, time

@api_view(['GET'])
@permission_classes([IsAuthenticated]) # <-- [FIX 2] TAMBAHKAN DEKORATOR INI
def statistik_siswa(request):
    # --- 1. Ambil Parameter Filter dari Frontend ---
    tahun_ajaran_filter = request.query_params.get('tahunAjaran', None)
    semester_filter = request.query_params.get('semester', 'Semua')

    # --- 2. Tentukan Periode Waktu Berdasarkan Filter ---
    # Logika untuk menentukan tahun ajaran default jika tidak ada filter
    if not tahun_ajaran_filter:
        now_date = timezone.now()
        current_year = now_date.year
        # Tahun ajaran dimulai bulan Juli (bulan ke-7)
        if now_date.month >= 7:
            tahun_ajaran_filter = f"{current_year}/{current_year + 1}"
        else:
            tahun_ajaran_filter = f"{current_year - 1}/{current_year}"

    # Parsing tahun ajaran
    try:
        start_year_str, end_year_str = tahun_ajaran_filter.split('/')
        start_year, end_year = int(start_year_str), int(end_year_str)
    except (ValueError, IndexError):
        now_date = timezone.now()
        start_year, end_year = (now_date.year, now_date.year + 1) if now_date.month >= 7 else (now_date.year - 1, now_date.year)

    # [FIX] Tentukan rentang tanggal dengan cara yang timezone-aware
    if semester_filter == 'Ganjil':
        start_date = timezone.make_aware(datetime(start_year, 7, 1))
        # Pastikan akhir hari juga terhitung
        end_date = timezone.make_aware(datetime.combine(datetime(start_year, 12, 31), time.max))
    elif semester_filter == 'Genap':
        start_date = timezone.make_aware(datetime(end_year, 1, 1))
        end_date = timezone.make_aware(datetime.combine(datetime(end_year, 6, 30), time.max))
    else: # Semester "Semua"
        start_date = timezone.make_aware(datetime(start_year, 7, 1))
        end_date = timezone.make_aware(datetime.combine(datetime(end_year, 6, 30), time.max))

    # --- 3. Bangun QuerySet Dasar dengan Filter Waktu ---
    queryset = Siswa.objects.filter(created_at__range=(start_date, end_date))

    # --- 4. Lakukan Agregasi (Hitungan) dalam Satu Query ---
    statistik = queryset.aggregate(
        total_x=Count('pk', filter=Q(kelas='X')),
        total_xi=Count('pk', filter=Q(kelas='XI')),
        total_xii=Count('pk', filter=Q(kelas='XII')),
        laki=Count('pk', filter=Q(jenis_kelamin='L')),
        perempuan=Count('pk', filter=Q(jenis_kelamin='P')),
        status_baru=Count('pk', filter=Q(status='BARU')),
        status_aktif=Count('pk', filter=Q(status='AKTIF')),
        status_lulus=Count('pk', filter=Q(status='LULUS')),
        status_pindah=Count('pk', filter=Q(status='PINDAH')),
        status_dropout=Count('pk', filter=Q(status='DROPOUT')),
    )

    # --- 5. Hitung Metrik Lain (jika ada) ---
    # Contoh: tren siswa baru bulan lalu (ini tidak terpengaruh filter utama)
    today = timezone.now()
    start_of_month = today.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    start_of_last_month = (start_of_month - timezone.timedelta(days=1)).replace(day=1)
    end_of_last_month = start_of_month - timezone.timedelta(microseconds=1)
    siswa_baru_bulan_lalu = Siswa.objects.filter(
        created_at__range=(start_of_last_month, end_of_last_month)
    ).count()

    # --- 6. Susun Respon JSON Sesuai Kebutuhan Frontend ---
    total_siswa = statistik['total_x'] + statistik['total_xi'] + statistik['total_xii']

    return Response({
        "kelas": {
            "X": statistik['total_x'],
            "XI": statistik['total_xi'],
            "XII": statistik['total_xii'],
        },
        "total": total_siswa,
        "laki": statistik['laki'],
        "perempuan": statistik['perempuan'],
        "siswa_baru_bulan_lalu": siswa_baru_bulan_lalu,
        "status": {
            "aktif": statistik['status_aktif'],
            "lulus": statistik['status_lulus'],
            "pindah": statistik['status_pindah'],
            "dropout": statistik['status_dropout'],
        },
        "total_baru": statistik['status_baru'],
    })


class SiswaViewSet(viewsets.ModelViewSet):
    queryset = Siswa.objects.all().order_by('-created_at')
    serializer_class = SiswaSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['kelas', 'status']
    search_fields = ['nama_lengkap', 'nisn', 'nik']
    
    # Menentukan permission_classes berdasarkan aksi (Logika ini sudah benar)
    def get_permissions(self):
        if self.action == 'create':
            # Siapa saja boleh mendaftar (untuk form publik)
            self.permission_classes = [AllowAny] # <-- Diperbaiki agar lebih eksplisit
        else:
            # Aksi lain (list, retrieve, update, delete) butuh autentikasi
            self.permission_classes = [IsAuthenticated] # <-- Diperbaiki agar lebih eksplisit
        return super(SiswaViewSet, self).get_permissions()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("❌ Serializer Errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)