# In views.py
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import InterviewerDetails
from .serializers import InterviewerDetailsSerializer

@api_view(['POST'])
def interviewer_form(request):
    if request.method == 'POST':
        # Check if an Interviewer record with the provided email exists
        email = request.data.get('email')
        try:
            interviewer = InterviewerDetails.objects.get(email=email)
            # If record exists, update it with the new data
            serializer = InterviewerDetailsSerializer(interviewer, data=request.data)
        except InterviewerDetails.DoesNotExist:
            # If record doesn't exist, create a new one
            serializer = InterviewerDetailsSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)