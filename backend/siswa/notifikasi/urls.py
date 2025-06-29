# notifikasi/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NotifikasiViewSet

router = DefaultRouter()
router.register(r'', NotifikasiViewSet, basename='notifikasi')

urlpatterns = [
    path('', include(router.urls)),
]