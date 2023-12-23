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
                'status': data['status'],
            }))
