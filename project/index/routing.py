# your_app/routing.py
from django.urls import path
from .consumers import ContactConsumer, ChatConsumer

websocket_urlpatterns = [
    path('ws/contacts/', ContactConsumer.as_asgi()),
    path('ws/chats/', ChatConsumer.as_asgi()),
]
