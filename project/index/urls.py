from django.urls import path
from .views import register_user, login_user, \
    get_user_data, \
    get_contactlist, get_requestlist, get_responselist, \
    add_friend, respond_to_friend_request, \
    delete_friend, \
    get_chatlist, add_chat, get_chatmessage, send_message

urlpatterns = [
    path('register/', register_user, name='register_user'),
    path('login/', login_user, name='login_user'),

    path('userprofile/', get_user_data, name='get_user_data'),

    path('contactlist/', get_contactlist, name='get_contactlist'),
    path('requestlist/', get_requestlist, name='get_requestlist'),
    path('responselist/', get_responselist, name='get_responselist'),

    path('addfriend/', add_friend, name='add_friend'),
    path('respondtofriendrequest/', respond_to_friend_request, name='respond_to_friend_request'),

    path('deletefriend/', delete_friend, name='delete_friend'),

    path('chatlist/', get_chatlist, name='get_chatlist'),
    path('addchat/', add_chat, name='add_chat'),
    path('chatmessage/', get_chatmessage, name='get_chatmessage'),
    path('sendmessage/', send_message, name='send_message'),
]
