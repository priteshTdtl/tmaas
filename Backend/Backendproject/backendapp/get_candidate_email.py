from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Student

@api_view(['GET'])
def get_candidate_email(request, candidate_name):
    try:
        student = Student.objects.get(name=candidate_name)
        email = student.email
        return Response({'email': email})
    except Student.DoesNotExist:
        return Response({'error': 'Candidate not found'}, status=404)