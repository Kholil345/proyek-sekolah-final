# notifikasi/serializers.py

from rest_framework import serializers
from .models import Notifikasi

class NotifikasiSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notifikasi
        fields = ['id', 'title', 'content', 'is_read', 'timestamp']