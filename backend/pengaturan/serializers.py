# pengaturan/serializers.py
from rest_framework import serializers
from .models import PengaturanPendaftaran

class PengaturanPendaftaranSerializer(serializers.ModelSerializer):
    class Meta:
        model = PengaturanPendaftaran
        fields = ['is_open']