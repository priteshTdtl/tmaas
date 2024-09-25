from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import StudentSerializer
from .models import Applicant
from .models import PersonalityResult
from django.db import transaction
import nltk
nltk.download('punkt')
nltk.download('stopwords')


@api_view(['POST'])
def create_student(request):
    serializer = StudentSerializer(data=request.data)
    if serializer.is_valid():
        with transaction.atomic():
            serializer.validated_data['created_by'] = "Admin"
            student = serializer.save()
            student_id = student.id
            email = request.data.get('email')  
            Applicant_instance = Applicant(email=email, user_id=student_id)
            Applicant_instance.save()
            Personality_instance=PersonalityResult(applicant_id=student_id)
            Personality_instance.save()
 
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)