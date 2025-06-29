# akun/serializers.py

from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Profile

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    role = serializers.ChoiceField(choices=Profile.ROLE_CHOICES, write_only=True, required=False)

    class Meta:
        model = User
        fields = ('username', 'password', 'password2', 'email', 'first_name', 'last_name', 'role')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password and confirmation fields didn't match."})
        return attrs

    def create(self, validated_data):
        role_data = validated_data.pop('role', 'ADMIN')

        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        user.set_password(validated_data['password'])
        user.save()

        # Simpan role ke profil user yang baru dibuat (setelah user.save())
        user.profile.role = role_data
        user.profile.save()

        return user


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Tambahkan data custom ke dalam token
        token['username'] = user.username
        token['full_name'] = user.get_full_name()
        token['email'] = user.email
        
        if hasattr(user, 'profile'):
            token['profile_picture_url'] = user.profile.foto_profil_url
            token['role'] = user.profile.role
        else:
            # Fallback jika profile belum ada (misal untuk user lama)
            profile = Profile.objects.create(user=user)
            token['profile_picture_url'] = profile.foto_profil_url
            token['role'] = profile.role

        return token
    
class UpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email')

class UpdateProfileSerializer(serializers.ModelSerializer):
    user = UpdateUserSerializer()

    class Meta:
        model = Profile
        fields = ('user', 'foto_profil')

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        user_serializer = UpdateUserSerializer(instance.user, data=user_data, partial=True)
        if user_serializer.is_valid(raise_exception=True):
            user_serializer.save()
        
        # Update profile, termasuk foto profil
        return super().update(instance, validated_data)


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
    new_password2 = serializers.CharField(required=True)

    def validate(self, data):
        if data['new_password'] != data['new_password2']:
            raise serializers.ValidationError({"new_password": "Password baru dan konfirmasi tidak cocok."})
        return data