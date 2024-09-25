from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import JobApplication
from django.utils import timezone 

@api_view(['PUT'])
def update_applicant_status(request, id):
    try:
        new_status = request.data.get('job_status')
        job_application = JobApplication.objects.get(id=id)
        job_application.job_status = new_status
        job_application.status_update_time = timezone.now()
        
        job_application.save()

        return Response({'message': 'Job status updated successfully'})

    except JobApplication.DoesNotExist:
        return Response({'error': 'Job application does not exist'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
