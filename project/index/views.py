from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from rest_framework.decorators import api_view

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
        return JsonResponse({'message': 'Login successful'}, status=200)
    else:
        return JsonResponse({'error': 'Invalid credentials'}, status=401)

@api_view(['GET'])
def get_user_data(request, user_id):
    try:
        # Fetch user data from the database
        user = User.objects.get(pk=user_id)

        # Return user data in the response
        user_data = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
        }

        return Response(user_data, status=200)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
