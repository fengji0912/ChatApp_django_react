# consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer

class ContactConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        data = json.loads(text_data)
        type = data.get('type')

        if type == 'friend_request_response':
            # Handle friend request response, you can broadcast it to other connected clients
            # Update this logic according to your needs
            await self.send(text_data=json.dumps({
                'type': 'friend_request_response',
                'id': data['id'],
                'username': data['username'],
                'email': data['email'],
                'status': data['status'],
            }))

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        data = json.loads(text_data)
        type = data.get('type')

        if type == 'chat_list':
            # Handle friend request response, you can broadcast it to other connected clients
            # Update this logic according to your needs
            await self.send(text_data=json.dumps({
                'type': 'chat_list',
                'id': data['id'],
                'username': data['username'],
            }))

        if type == 'chat_message':
            # Handle friend request response, you can broadcast it to other connected clients
            # Update this logic according to your needs
            await self.send(text_data=json.dumps({
                'type': 'chat_message',
                'id': data['id'],
                'sender': data['sender'],
                'receiver': data['receiver'],
                'message_text': data['message_text'],
                'timestamp': data['timestamp'],
            }))

