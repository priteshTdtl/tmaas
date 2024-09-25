from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import JobApplication

@csrf_exempt
def get_applied_job_for_interviewers(request, candidate_email):
    if request.method == 'GET':
        try:
            job_applications = JobApplication.objects.filter(email=candidate_email)
            job_titles = [job.job_title for job in job_applications]
            return JsonResponse({'job_titles': job_titles})
        except JobApplication.DoesNotExist:
            return JsonResponse({'job_titles': []})
    return JsonResponse({'error': 'Invalid request method'})
