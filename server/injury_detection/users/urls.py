from django.urls import path
from .views import register_user, login_user, UserProfileView

urlpatterns = [
    path("register/", register_user, name="register_user"),
    path("login/", login_user, name="login_user"),
    path("profile/", UserProfileView.as_view(), name="user_profile"),
]
