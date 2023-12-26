from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from rest_framework.decorators import api_view
from rest_framework.authtoken.models import Token
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import FriendRequest
from django.shortcuts import get_object_or_404


@csrf_exempt
@api_view(['POST'])
def register_user(request):
    data = request.data

    email = data.get('email', None)
    username = data.get('username', None)
    password = data.get('password', None)

    if not email or not username or not password:
        return JsonResponse({'error': 'Incomplete registration data'}, status=400)

    try:
        # Validate email format
        validate_email(email)

        # Create a new user in the database
        user = User.objects.create_user(username=username, email=email, password=password)
        user.save()

        return JsonResponse({'message': 'User registered successfully'}, status=201)
    except ValidationError as e:
        return JsonResponse({'error': 'Invalid email format'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


@csrf_exempt
@api_view(['POST'])
def login_user(request):
    data = request.data

    print("Received login data:", data)
    username = data.get('username', None)
    password = data.get('password', None)

    if not username or not password:
        return JsonResponse({'error': 'Incomplete login data'}, status=400)

    user = authenticate(request, username=username, password=password)

    if user is not None:
        # Generate or get the token
        token, created = Token.objects.get_or_create(user=user)

        # Include user ID and token in the response
        user_id = user.id
        return JsonResponse({'message': 'Login successful', 'user_id': user_id, 'token': token.key}, status=200)
    else:
        return JsonResponse({'error': 'Invalid credentials'}, status=401)


@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_data(request):
    # The user is already authenticated at this point
    print(request.user)
    user = request.user
    # Retrieve user data
    user_data = {
        'username': user.username,
        'email': user.email,
        'user_id': user.id,
        # Add other user data fields as needed
    }

    return Response(user_data)


@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_contactlist(request):
    user_id = request.user.id

    existing_requests = FriendRequest.objects.filter(sender_id=user_id) \
                        | FriendRequest.objects.filter(receiver_id=user_id)

    friend_ids = [existing_request.receiver_id if existing_request.sender_id == user_id \
                      else existing_request.sender_id for existing_request in existing_requests \
                  if existing_request.status == 'accepted']
    friends = User.objects.filter(id__in=friend_ids)
    contact_list = [{'id': friend.id, 'username': friend.username, 'email': friend.email} \
                    for friend in friends]

    return Response(contact_list)


@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_requestlist(request):
    user_id = request.user.id
    request_list = []
    existing_requests = FriendRequest.objects.filter(sender_id=user_id)
    for existing_request in existing_requests:
        friend_id = existing_request.receiver_id
        friend = User.objects.get(id=friend_id)
        request_list.append({'id': friend.id, 'email': friend.email, 'status': existing_request.status})

    return Response(request_list)


@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_responselist(request):
    user_id = request.user.id
    response_list = []
    existing_requests = FriendRequest.objects.filter(receiver_id=user_id)
    for existing_request in existing_requests:
        friend_id = existing_request.sender_id
        friend = User.objects.get(id=friend_id)
        response_list.append({'id': friend.id, 'email': friend.email, 'status': existing_request.status})

    return Response(response_list)


@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_friend(request):
    friend_email = request.data.get('email')

    try:
        friend = User.objects.get(email=friend_email)
    except User.DoesNotExist:
        return JsonResponse({'detail': 'User not found with the provided email.'}, status=404)

    FriendRequest.objects.create(sender=request.user, receiver=friend, status='pending')

    return JsonResponse({'detail': 'Friend request sent successfully.'})


@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def respond_to_friend_request(request):
    user = request.user
    friend = request.data.get('id')
    status = request.data.get('status')

    friend_request = get_object_or_404(FriendRequest, sender=friend, receiver=user, status='pending')

    friend_request.status = status
    friend_request.save()

    return JsonResponse({'detail': 'Friend request responded successfully.'})


@csrf_exempt
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_friend(request):
    user_id = request.user.id
    friend = request.data.get('friend')
    friend_id = friend['id']
    connection = get_object_or_404(FriendRequest, sender_id=user_id, receiver_id=friend_id)
    if connection:
        connection.delete()
    else:
        connection = get_object_or_404(FriendRequest, sender_id=friend_id, receiver_id=user_id)
        connection.delete()

    return JsonResponse({'detail': 'Friend deleted successfully.'})


@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_chatlist(request):
    user_id = request.user.id

    existing_requests = FriendRequest.objects.filter(sender_id=user_id) \
                        | FriendRequest.objects.filter(receiver_id=user_id)

    chat_ids = [existing_request.receiver_id if existing_request.sender_id == user_id \
                      else existing_request.sender_id for existing_request in existing_requests \
                  if existing_request.status == 'accepted' and existing_requests.chat_status == 'exist']
    chats = User.objects.filter(id__in=chat_ids)
    chat_list = [{'id': chat.id, 'username': chat.username, 'email': chat.email} \
                    for chat in chats]

    return Response(chat_list)


@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_chat(request):
    chat_username = request.data.get('username')

    try:
        chat = FriendRequest.objects.get(username=chat_username)
    except FriendRequest.DoesNotExist:
        return JsonResponse({'detail': 'FriendRequest not found with the provided username.'}, status=404)

    chat.chat_status = 'exist'  # Replace 'your_new_chat_status' with the desired chat status
    chat.save()

    return JsonResponse({'detail': 'add chat successfully.'})
