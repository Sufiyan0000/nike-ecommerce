# auth_app/views.py

from django.conf import settings
from django.http import JsonResponse, HttpRequest, HttpResponse
from django.views.decorators.http import require_POST
from django.shortcuts import redirect, render
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt

from . import services
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer,SignUpSerializer

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer



def _set_guest_cookie(response: HttpResponse, token: str):
    max_age = 7 * 24 * 60 * 60  # 7 days
    response.set_cookie(
        "guest_session",
        token,
        max_age=max_age,
        httponly=True,
        secure=settings.SESSION_COOKIE_SECURE,
        samesite="Strict",
        path="/",
    )


def _clear_guest_cookie(response: HttpResponse):
    response.delete_cookie("guest_session", path="/")

class SignUpView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SignUpSerializer(data = request.data)
        serializer.is_valid(raise_exception=True)



        user = services.sign_up(
            request,
            email=serializer.validated_data["email"],
            password=serializer.validated_data["password"],
            name=serializer.validated_data.get("name")
        )

        refresh = RefreshToken.for_user(user=user)

        guest_token = request.COOKIES.get("guest_session")
        if guest_token:
            services.merge_guest_cart_with_user_cart(user,guest_token)
            _clear_guest_cookie(response)

        response = Response(
            {
                "message": "Signed up successfully",
                "user": {
                    "id": str(user.id),
                    "email": user.email,
                    "name": user.name,
                },
                "tokens": {
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                },
            },
            status=status.HTTP_201_CREATED
        )

        return response
    
class SignInView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email", "").strip()
        password = request.data.get("password", "")

        if not email or not password:
            return Response(
                {"error": "Email and password are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = services.sign_in(request, email=email, password=password)

        if not user:
            return Response(
                {"error": "Invalid credentials."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        guest_token = request.COOKIES.get("guest_session")

        response = Response({
            "message": "Signed in successfully",
            "user": {
                "id": str(user.id),
                "email": user.email,
                "name": user.name,
            },
        })

        if guest_token:
            services.merge_guest_cart_with_user_cart(user, guest_token)
            _clear_guest_cookie(response)

        return response

from rest_framework.permissions import IsAuthenticated


class SignOutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        services.sign_out(request)
        return Response({"message": "Signed out successfully"})

class CreateGuestSessionView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        existing_token = request.COOKIES.get("guest_session")
        response = Response({"message": "Guest session active"})

        if existing_token:
            guest = services.get_guest_from_token(existing_token)
            if guest:
                return response

        guest = services.create_guest_session()
        _set_guest_cookie(response, guest.session_token)
        return response

class CheckoutView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "message": "Checkout page",
            "user": {
                "id": str(request.user.id),
                "email": request.user.email,
            }
        })
    
class LoginWithGuestMergeView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        # If login failed, return immediately
        if response.status_code != 200:
            return response

        guest_token = request.COOKIES.get("guest_session")

        if guest_token:
            user = request.user
            services.merge_guest_cart_with_user_cart(user, guest_token)
            _clear_guest_cookie(response)

        return response

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request):
        user = request.user
        return Response({
            "id": str(user.id),
            "email": user.email,
            "name": user.name,
            "image": user.image if user.image else None,
        })


def login_page(request: HttpRequest) -> HttpResponse:
    """
    Simple HTML login page placeholder (for redirect).
    You can replace with template.
    """
    next_url = request.GET.get("next", "/")
    return render(request, "auth_app/login.html", {"next": next_url})

