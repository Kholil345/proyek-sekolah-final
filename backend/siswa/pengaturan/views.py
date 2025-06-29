# pengaturan/views.py

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny 
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import PengaturanPendaftaran
from .serializers import PengaturanPendaftaranSerializer

class PengaturanPendaftaranViewSet(viewsets.ModelViewSet):
    serializer_class = PengaturanPendaftaranSerializer
    
    def get_queryset(self):
        # Memastikan hanya ada satu instance yang bisa diakses
        return PengaturanPendaftaran.objects.filter(pk=1)

    def get_permissions(self):
        # Cek aksi yang sedang diminta (list, update, dll)
        if self.action in ['status']:
            # Siapa saja (bahkan yang belum login) boleh mengecek status pendaftaran
            self.permission_classes = [AllowAny,]
        else:
            # [FIX] Aksi lainnya (mengambil detail, mengubah status) sekarang bisa dilakukan
            # oleh SEMUA PENGGUNA YANG SUDAH LOGIN, apapun rolenya.
            self.permission_classes = [IsAuthenticated,]
        return super(self.__class__, self).get_permissions()

    @action(detail=False, methods=['get'])
    def status(self, request):
        # Endpoint publik untuk mengecek apakah pendaftaran dibuka
        pengaturan = PengaturanPendaftaran.load()
        return Response({'is_open': pengaturan.is_open})