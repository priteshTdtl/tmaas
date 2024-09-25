
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from .models import JobApplication
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def withdraw_job_application(request, job_app_id):
    job_application = get_object_or_404(JobApplication, id=job_app_id)
    if request.method == 'DELETE':
        job_application.delete()
        return JsonResponse({'message': 'Job application withdrawn successfully'}, status=200)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)
