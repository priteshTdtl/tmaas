from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import InterviewerDetails
from .serializers import InterviewerDetailsSerializer


@api_view(['GET'])
def get_interviewers(request):
    interviewers = InterviewerDetails.objects.all()
    serializer = InterviewerDetailsSerializer(interviewers, many=True)
    return Response(serializer.data)