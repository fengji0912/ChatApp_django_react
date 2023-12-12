from django.urls import path
from .views import register_user, login_user, get_user_data

urlpatterns = [
    path('register/', register_user, name='register_user'),
    path('login/', login_user, name='login_user'),
    path('UserProfile/', get_user_data, name='get_user_data'),
    # 其他路由...
]
