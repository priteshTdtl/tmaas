from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Student

@api_view(['PUT'])
def activate_student_account(request, pk):
    try:
        student = Student.objects.get(pk=pk)
    except Student.DoesNotExist:
        return Response({"message": "Student not found."}, status=404)

    student.account_status = 'Active'
    student.save()

    return Response({"message": "Student account activated successfully."}, status=200)