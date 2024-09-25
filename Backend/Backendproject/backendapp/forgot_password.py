from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.mail import send_mail
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import connection
import json
from hashlib import sha256
from time import time
 
@csrf_exempt
def forgot_password(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email', '')
 
        # Validate email
        if not email:
            return JsonResponse({'error': 'Email is required'}, status=400)
 
        # Check if the email exists in your database
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM users WHERE email = %s", [email])
            user_data = cursor.fetchone()
 
        if not user_data:
            return JsonResponse({'error': 'User with this email does not exist'}, status=404)
 
        user_id, _, user_email, *_ = user_data  # Assuming user_id is the first column in your SELECT query
 
        # Combine user ID and timestamp to create a unique token
        timestamp = str(int(time()))
        combined_data = f"{user_id}-{timestamp}"
 
        # Hash the combined data using SHA-256 (or any secure hash function)
        token = sha256(force_bytes(combined_data)).hexdigest()
 
        # Create reset link
        uidb64 = urlsafe_base64_encode(force_bytes(user_id))
        reset_link = f"http://localhost:3000/newPass/{uidb64}/{token}/"
        text = f'Click the following link to reset your password:\n\n{reset_link}'
 
        # Send reset link to user's email
        subject = 'Password Reset'
        from_email = 'pr@tdtl.world'
        to_email = [user_email]
 
        try:
            send_mail(subject, text, from_email, to_email, fail_silently=False)
        except Exception as e:
            return JsonResponse({'error': f'Error sending email: {e}'}, status=500)
 
        return JsonResponse({'message': 'Password reset link sent to your email'})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
