# auth_app/services.py

import uuid
from datetime import timedelta
from typing import Optional

from django.utils import timezone
from django.contrib.auth import get_user_model, authenticate, login, logout
from django.db import transaction
from django.http import HttpRequest
from django.contrib.auth.models import User

from .models import Session, Account, Guest

User = get_user_model()


SESSION_LIFETIME_DAYS = 7
GUEST_SESSION_LIFETIME_DAYS = 7


def _create_session_record(user: User, request: Optional[HttpRequest] = None) -> Session:
    """Create a Session row for analytics / tracking."""
    now = timezone.now()
    token = uuid.uuid4().hex
    ip = None
    ua = None
    if request:
        ip = request.META.get("REMOTE_ADDR")
        ua = request.META.get("HTTP_USER_AGENT")

    session = Session.objects.create(
        user=user,
        token=token,
        ip_address=ip,
        user_agent=ua,
        expires_at=now + timedelta(days=SESSION_LIFETIME_DAYS),
    )
    return session


@transaction.atomic
def sign_up(request: HttpRequest, email: str, password: str, name: Optional[str] = None) -> User:
    """Create a new user + account and log them in."""
    email = email.strip().lower()
    user = User.objects.create_user(email=email, password=password, name=name)

    # Create credentials account
    Account.objects.create(
        user=user,
        account_id=email,
        provider_id="credentials",
        password=user.password,  # already hashed by set_password
    )

    # Log in via Django auth system
    login(request, user)
    _create_session_record(user, request=request)
    return user


@transaction.atomic
def sign_in(request: HttpRequest, email: str, password: str) -> Optional[User]:
    """Authenticate and login user. Returns user or None."""
    email = email.strip().lower()
    user = authenticate(request, email=email, password=password)
    if user is None:
        return None

    login(request, user)
    _create_session_record(user, request=request)
    return user


def sign_out(request: HttpRequest):
    """Logout current user."""
    logout(request)
    # Django will clear auth_session cookie automatically by ending the session.


def create_guest_session() -> Guest:
    """Create a Guest record and return it."""
    now = timezone.now()
    token = uuid.uuid4().hex
    guest = Guest.objects.create(
        session_token=token,
        expires_at=now + timedelta(days=GUEST_SESSION_LIFETIME_DAYS),
    )
    return guest


def get_guest_from_token(token: str) -> Optional[Guest]:
    try:
        guest = Guest.objects.get(session_token=token)
        if guest.expires_at < timezone.now():
            guest.delete()
            return None
        return guest
    except Guest.DoesNotExist:
        return None


def merge_guest_cart_with_user_cart(user: User, guest_token: str):
    """
    Migrate guest-related data to the given user.
    For now, just delete the guest; in real app, you'd move Cart items.
    """
    guest = get_guest_from_token(guest_token)
    if not guest:
        return

    # TODO: when you have Cart model, move cart items from guest to user here.

    guest.delete()
