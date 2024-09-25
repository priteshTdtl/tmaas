from django.http import JsonResponse
from .models import InterviewerDetails
from .serializers import InterviewerDetailsSerializer

def interviewer_detail_list(request):
    interviewer_details = InterviewerDetails.objects.all()
    serializer = InterviewerDetailsSerializer(interviewer_details, many=True)
    return JsonResponse(serializer.data, safe=False)
