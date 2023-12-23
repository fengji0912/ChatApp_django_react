# your_app/routing.py
from django.urls import path
from .consumers import ContactConsumer

websocket_urlpatterns = [
    path('ws/contacts/', ContactConsumer.as_asgi()),
]
