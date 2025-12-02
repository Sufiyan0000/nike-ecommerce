# auth_app/views.py

from django.conf import settings
from django.http import JsonResponse, HttpRequest, HttpResponse
from django.views.decorators.http import require_POST
from django.shortcuts import redirect, render
from django.contrib.auth.decorators import login_required

from . import services


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


@require_POST
def sign_up_view(request: HttpRequest) -> HttpResponse:
    email = request.POST.get("email", "").strip()
    password = request.POST.get("password", "")
    name = request.POST.get("name", "")

    if not email or not password:
        return JsonResponse({"error": "Email and password are required."}, status=400)

    user = services.sign_up(request, email=email, password=password, name=name or None)

    # Merge guest cart if guest_session exists
    guest_token = request.COOKIES.get("guest_session")
    response = JsonResponse({"message": "Signed up successfully", "user_id": str(user.id)})

    if guest_token:
        services.merge_guest_cart_with_user_cart(user, guest_token)
        _clear_guest_cookie(response)

    return response


@require_POST
def sign_in_view(request: HttpRequest) -> HttpResponse:
    email = request.POST.get("email", "").strip()
    password = request.POST.get("password", "")

    if not email or not password:
        return JsonResponse({"error": "Email and password are required."}, status=400)

    user = services.sign_in(request, email=email, password=password)
    if not user:
        return JsonResponse({"error": "Invalid credentials."}, status=401)

    guest_token = request.COOKIES.get("guest_session")
    response = JsonResponse({"message": "Signed in successfully", "user_id": str(user.id)})

    if guest_token:
        services.merge_guest_cart_with_user_cart(user, guest_token)
        _clear_guest_cookie(response)

    return response


@require_POST
def sign_out_view(request: HttpRequest) -> HttpResponse:
    services.sign_out(request)
    response = JsonResponse({"message": "Signed out successfully"})
    return response


def create_guest_session_view(request: HttpRequest) -> HttpResponse:
    """
    Create guest session if not already present.
    Can be called on first visit or when user adds to cart.
    """
    existing_token = request.COOKIES.get("guest_session")
    response = JsonResponse({"message": "Guest session active"})

    if existing_token:
        # Just validate existing guest
        guest = services.get_guest_from_token(existing_token)
        if guest:
            return response
        # If expired/invalid, fall through to create new

    guest = services.create_guest_session()
    _set_guest_cookie(response, guest.session_token)
    return response


@login_required(login_url="/auth/login/")
def checkout_view(request: HttpRequest) -> HttpResponse:
    """
    Protected checkout route.
    If user is not authenticated, login_required decorator will redirect.
    After login, you can redirect back here using 'next' parameter.
    """
    # Here you'd show checkout page or return JSON
    return JsonResponse({"message": "Checkout page (user is authenticated)."})


def login_page(request: HttpRequest) -> HttpResponse:
    """
    Simple HTML login page placeholder (for redirect).
    You can replace with template.
    """
    next_url = request.GET.get("next", "/")
    return render(request, "auth_app/login.html", {"next": next_url})

