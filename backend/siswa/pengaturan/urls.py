# pengaturan/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PengaturanPendaftaranViewSet

router = DefaultRouter()
router.register(r'pendaftaran', PengaturanPendaftaranViewSet, basename='pengaturan-pendaftaran')

urlpatterns = [
    path('', include(router.urls)),
]