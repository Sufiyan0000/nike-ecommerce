from django.contrib.auth import get_user_model

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed as AuthFailed

User = get_user_model()


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Allows login using EMAIL instead of username
    """
    username_field = User.USERNAME_FIELD

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        if not email or not password:
            raise AuthFailed("Invalid email or password")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise Exception("Invalid email or password")
        
        if not user.check_password(password):
            raise AuthFailed("Invalid email or password")

        
        return super().validate(attrs)

class SignUpSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(min_length=8,write_only=True)
    name = serializers.CharField(required=False,allow_blank=True)

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email Already exists")
        return value
    
class SignInSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only = True)