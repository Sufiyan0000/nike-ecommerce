# auth_app/urls.py

from django.urls import path
from . import views
from django.urls import path
from .views import MyTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView


app_name = "auth_app"

urlpatterns = [
    path("sign-up/", views.SignUpView.as_view(), name="sign-up"),
    path("sign-in/", views.SignInView.as_view(), name="sign-in"),
    path("sign-out/", views.SignOutView.as_view(), name="sign-out"),
    path("me/",views.MeView.as_view(),name="me"),
    path("guest-session/", views.CreateGuestSessionView.as_view(), name="guest_session"),
    path("checkout/", views.CheckoutView.as_view(), name="checkout"),
    
    path("login/", views.LoginWithGuestMergeView.as_view()),
    

    # JWT Token endpoints
    path("token/", MyTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
