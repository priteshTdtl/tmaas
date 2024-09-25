from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Student

@api_view(['DELETE'])
def delete_student(request, pk):
    student = Student.objects.get(pk=pk)
    student.delete()
    return Response(status=204)