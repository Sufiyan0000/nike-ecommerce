# auth_app/urls.py

from django.urls import path
from . import views

app_name = "auth_app"

urlpatterns = [
    path("signup/", views.sign_up_view, name="signup"),
    path("signin/", views.sign_in_view, name="signin"),
    path("signout/", views.sign_out_view, name="signout"),
    path("guest-session/", views.create_guest_session_view, name="guest_session"),
    path("checkout/", views.checkout_view, name="checkout"),
    path("login/", views.login_page, name="login_page"),
]
