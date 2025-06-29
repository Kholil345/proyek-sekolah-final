# akun/views.py

from rest_framework import generics, status
# [UBAH] Tambahkan IsAuthenticated
from rest_framework.permissions import AllowAny, IsAuthenticated 
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import (
    RegisterSerializer, MyTokenObtainPairSerializer, 
    UpdateProfileSerializer, ChangePasswordSerializer
)

class UpdateProfileView(generics.UpdateAPIView):
    queryset = User.objects.all()
    permission_classes = (IsAuthenticated,)
    serializer_class = UpdateProfileSerializer

    def get_object(self):
        # Mengambil profile dari user yang sedang login
        return self.request.user.profile

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        
        if serializer.is_valid(raise_exception=True):
            self.perform_update(serializer)
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# [BARU] View untuk ganti password
class ChangePasswordView(generics.UpdateAPIView):
    permission_classes = (IsAuthenticated,)
    
    def update(self, request, *args, **kwargs):
        user = self.request.user
        serializer = ChangePasswordSerializer(data=request.data)

        if serializer.is_valid():
            # Cek password lama
            if not user.check_password(serializer.data.get("old_password")):
                return Response({"old_password": ["Password lama salah."]}, status=status.HTTP_400_BAD_REQUEST)
            
            # Set password baru
            user.set_password(serializer.data.get("new_password"))
            user.save()
            return Response({"status": "password set"}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# View kustom untuk login/token yang mengembalikan data tambahan
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

# Class-based view untuk registrasi user baru
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    # Siapa saja boleh mengakses halaman registrasi ini.
    # Jika ingin hanya admin lain yang bisa menambah, ganti ke [IsAdminUser]
    permission_classes = (AllowAny,) 
    serializer_class = RegisterSerializer