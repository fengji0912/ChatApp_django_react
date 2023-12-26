# models.py
from django.db import models
from django.contrib.auth.models import User


class FriendRequest(models.Model):
    DoesNotExist = None
    objects = None
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_friend_requests')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_friend_requests')
    status_choices = [('pending', 'Pending'), ('accepted', 'Accepted'), ('declined', 'Declined')]
    status = models.CharField(max_length=10, choices=status_choices, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    chat_status_choices = [('exist', 'Exist'), ('not_exist', 'Not Exist')]
    chat_status = models.CharField(max_length=10, choices=chat_status_choices, default='not_exist')

    def __str__(self):
        return f"{self.sender} -> {self.receiver} ({self.status})"


class ChatMessage(models.Model):
    DoesNotExist = None
    objects = None
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    message_text = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender} -> {self.receiver} ({self.timestamp})"
