from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from .models import Student
from django.contrib.auth.hashers import make_password
from django.shortcuts import get_object_or_404
from django.shortcuts import get_object_or_404

@api_view(['GET'])
def read_student(request, id):
    student = get_object_or_404(Student, id=id)
   
    # Hash the password using make_password and update the student object
    student.password = make_password(student.password)
 
    # Convert student data to JSON format or serialize as needed
    serialized_student = {
        'id': student.id,
        'name': student.name,
        'email': student.email,
        'role': student.role,
        'password': student.password  
    }
    return JsonResponse(serialized_student)