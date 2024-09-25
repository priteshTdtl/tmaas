from django.shortcuts import render
from django.db import connection
from django.http import JsonResponse
from django.shortcuts import get_object_or_404  
from .models import JobApplication, Applicant
from django.views.decorators.csrf import csrf_exempt
import json
from django.db import transaction
from django.db.transaction import atomic
from django.utils import timezone 
@csrf_exempt
def jobtitle(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            jobtitle = data.get('jobtitle')
            id = data.get('id')  
            email = data.get('email')  
            applicant = get_object_or_404(Applicant, id=id)

            # Check if the applicant already has a job application for the specified job
            existing_job_application = JobApplication.objects.filter(applicant=applicant, job_title=jobtitle).first()

            if existing_job_application:
                return JsonResponse({'message': 'Applicant has already applied for this job'}, status=200)
            else:
                current_time = timezone.now()

                JobApplication.objects.create(applicant=applicant, job_title=jobtitle,status_update_time=current_time,applied_date=current_time, email=email)

                return JsonResponse({'message': 'Job title applied successfully', 'id': id})

        except Exception as e:
            transaction.set_rollback(True)
            print(f"Error: {e}")
            return JsonResponse({'error_message': str(e)}, status=500)

    return JsonResponse({'error_message': 'Invalid request method'}, status=400)
