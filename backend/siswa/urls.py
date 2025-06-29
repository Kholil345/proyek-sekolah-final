# siswa/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SiswaViewSet
from .views import statistik_siswa

router = DefaultRouter()
router.register(r'siswa', SiswaViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('statistik-siswa/', statistik_siswa),
    path('', include(router.urls)),
]
