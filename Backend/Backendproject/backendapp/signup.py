from django.shortcuts import render
from django.db import connection
from django.http import JsonResponse
from django.views import View
from django.shortcuts import get_object_or_404  
from .models import Feedback
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Student
from .serializers import StudentSerializer
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.csrf import csrf_protect
import json
import bcrypt
from django.db import transaction
from django.utils import timezone
 
 
@csrf_exempt
def Signup_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            name = data.get('name')
            email = data.get('email')
            role = 'Candidate'
            password = data.get('password')
            account_status='Active'
            created_by='User'
            created_at=timezone.now()
 
            if not name or not password:
                return JsonResponse({'error_message': 'Username and password are required'}, status=400)
               
            # First, create a new student record
            with connection.cursor() as cursor:
                cursor.execute("INSERT INTO backendapp_student (name, email, role, password,account_status, created_by,created_at) VALUES (%s, %s, %s, %s,%s,%s,%s)", [name, email, role, password,account_status,created_by,created_at])
                # Get the ID of the newly inserted student
                student_id = cursor.lastrowid
               
            # Then, insert the student ID into the applicant table
            with connection.cursor() as cursor:
                cursor.execute("INSERT INTO backendapp_applicant (user_id, email) VALUES (%s, %s)", [student_id, email])
                cursor.connection.commit()

            with connection.cursor() as cursor:
                cursor.execute("INSERT INTO backendapp_personalityresult (applicant_id) VALUES (%s)", [student_id])
                cursor.connection.commit()
 
            return JsonResponse({'message': 'Data successfully inserted into the database'})
 
        except Exception as e:
            # Rollback the transaction in case of an exception
            # transaction.set_rollback(True)
            print(f"Error: {e}")
            return JsonResponse({'error_message': str(e)}, status=500)
 
    return JsonResponse({'error_message': 'Invalid request method'}, status=400)
 