from django.utils.encoding import force_str, force_bytes
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.hashers import make_password, check_password
from django.db import connection
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import bcrypt

@csrf_exempt
def update_password(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        uidb64 = data.get('uidb64', '')
        token = data.get('token', '')
        password = data.get('password', '')
        

        # Validate required fields
        if not uidb64 or not token or not password :
            return JsonResponse({'error': 'All required fields are necessary for password reset'}, status=400)


        try:
            # Decode UID and token
            uid = force_str(urlsafe_base64_decode(uidb64))

            # Hash the password using bcrypt
            hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

            # Update hashed password in the users table
            with connection.cursor() as cursor:
                cursor.execute("UPDATE users SET password = %s WHERE id = %s", [hashed_password.decode('utf-8'), uid])

            return JsonResponse({'message': 'Password successfully updated!'})
        except Exception as e:
            return JsonResponse({'error': f'Error resetting password: {e}'}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)
