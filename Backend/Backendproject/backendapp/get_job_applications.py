from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Applicant
from .models import JobApplication
from .serializers import JobApplicationSerializer

@api_view(['GET'])
def get_job_applications(request, user_id):
    try:
        applicant = Applicant.objects.get(user_id=user_id)
        job_applications = JobApplication.objects.filter(applicant=applicant)
        serializer = JobApplicationSerializer(job_applications, many=True)
        return Response(serializer.data)
    except Applicant.DoesNotExist:
        return JsonResponse({'error': 'Applicant not found'}, status=404)