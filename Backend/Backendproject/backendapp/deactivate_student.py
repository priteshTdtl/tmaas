from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Student

@api_view(['PUT'])
def deactivate_student_account(request, pk):
    try:
        student = Student.objects.get(pk=pk)
    except Student.DoesNotExist:
        return Response({"message": "Student not found."}, status=404)

    student.account_status = 'Inactive'
    student.save()

    return Response({"message": "Student account deactivated successfully."}, status=200)