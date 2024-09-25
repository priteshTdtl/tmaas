from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Student
from .serializers import StudentSerializer
import nltk
nltk.download('punkt')
nltk.download('stopwords')

@api_view(['PUT'])
def update_student(request, pk):
    student = Student.objects.get(pk=pk)
    serializer = StudentSerializer(student, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    else:
        print(serializer.errors)  # Check the console or server logs for errors
        return Response(serializer.errors, status=400)