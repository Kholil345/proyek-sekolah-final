# file: nama_proyek/urls.py

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# [PENTING] Pastikan Anda import view KUSTOM dari aplikasi 'akun'
from akun.views import MyTokenObtainPairView 
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('siswa.urls')), 
    path('api/auth/', include('akun.urls')),
    path('api/pengaturan/', include('pengaturan.urls')),
    path('api/notifikasi/', include('notifikasi.urls')),

    # [FIX] Pastikan baris ini menggunakan MyTokenObtainPairView dari akun.views
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),

    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)