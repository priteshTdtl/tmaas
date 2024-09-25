from django.shortcuts import render
from django.db import connection
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
import json
import bcrypt
import traceback
from django.utils import timezone
import pytz

@csrf_exempt
def Login_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')

            if not email or not password:
                return JsonResponse({'error_message': 'Email and password are required'}, status=400)

            # Use a raw SQL query with a cursor to check against the custom table 'users'
            with connection.cursor() as cursor:
                cursor.execute("SELECT * FROM backendapp_student WHERE email = %s", [email])
                row = cursor.fetchone()

                if row:
                    # Check if the account is active
                    account_status = row[7]  
                    if account_status == 'Active':
                        # Verify the password using bcrypt
                        stored_password = row[4]  # Assuming password is in the third column
                        if bcrypt.checkpw(password.encode('utf-8'), stored_password.encode('utf-8')):
                            # Include user's role in the JsonResponse
                            user_data = {
                                'id': row[0],
                                'name': row[1],
                                'role': row[3],
                            }

                            # Convert UTC time to server's local time
                            server_local_time = timezone.localtime(timezone.now())

                            # Convert server's local time to 'Asia/Kolkata' timezone
                            india_timezone = pytz.timezone('Asia/Kolkata')
                            india_time = server_local_time.astimezone(india_timezone)

                            # Update the last_login field
                            cursor.execute("UPDATE backendapp_student SET last_login = %s WHERE email = %s", [india_time, email])

                            return JsonResponse({'message': 'Login successful', 'user': user_data})
                        else:
                            return JsonResponse({'error_message': 'Invalid email or password'}, status=401)
                    else:
                        return JsonResponse({'error_message': 'Your account is inactive. Please contact the administrator.'}, status=403)
                else:
                    return JsonResponse({'error_message': 'Invalid email or password'}, status=401)

        except Exception as e:
            traceback.print_exc()  # Print the traceback information
            return JsonResponse({'error_message': str(e)}, status=500)

    return JsonResponse({'error_message': 'Invalid request method'}, status=400)