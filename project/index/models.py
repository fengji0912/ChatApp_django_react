# models.py
from django.db import models
from django.contrib.auth.models import User

class FriendRequest(models.Model):
    objects = None
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_friend_requests')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_friend_requests')
    status_choices = [('pending', 'Pending'), ('accepted', 'Accepted'), ('declined', 'Declined')]
    status = models.CharField(max_length=10, choices=status_choices, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender} -> {self.receiver} ({self.status})"
