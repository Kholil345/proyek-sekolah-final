# akun/urls.py

from django.urls import path
from .views import RegisterView
from .views import RegisterView, UpdateProfileView, ChangePasswordView

urlpatterns = [
    # Endpoint untuk registrasi admin baru
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('profile/update/', UpdateProfileView.as_view(), name='profile_update'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
]