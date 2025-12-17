# auth_app/urls.py

from django.urls import path
from . import views

app_name = "auth_app"

urlpatterns = [
    path("sign-up/", views.sign_up_view, name="sign-up"),
    path("sign-in/", views.sign_in_view, name="signin"),
    path("sign-out/", views.sign_out_view, name="sign-out"),
    path("guest-session/", views.create_guest_session_view, name="guest_session"),
    path("checkout/", views.checkout_view, name="checkout"),
    path("login/", views.login_page, name="login_page"),
]
