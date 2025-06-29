# notifikasi/views.py

from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Notifikasi
from .serializers import NotifikasiSerializer

class NotifikasiViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet untuk melihat dan mengelola notifikasi.
    Hanya menampilkan notifikasi untuk user yang sedang login.
    """
    serializer_class = NotifikasiSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Filter notifikasi hanya untuk user yang sedang membuat request
        return Notifikasi.objects.filter(user=self.request.user)

    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        """
        Action untuk menandai notifikasi sebagai sudah dibaca.
        """
        notifikasi = self.get_object()
        notifikasi.is_read = True
        notifikasi.save()
        return Response({'status': 'notifikasi ditandai terbaca'})

    @action(detail=False, methods=['post'])
    def mark_all_as_read(self, request):
        """
        Action untuk menandai semua notifikasi sebagai sudah dibaca.
        """
        self.get_queryset().update(is_read=True)
        return Response({'status': 'semua notifikasi ditandai terbaca'})