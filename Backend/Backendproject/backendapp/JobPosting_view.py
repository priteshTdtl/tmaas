
# from django.http import JsonResponse
# from django.views.decorators.csrf import csrf_exempt
# import json
# from .models import Jobposting

# @csrf_exempt
# def JobPosting_view(request):
#     if request.method == 'POST':
#         try:
#             data = json.loads(request.body)
#             job_id = data.get('job_id')
#             jobtitle = data.get('jobtitle')
#             description = data.get('description')
#             vacancies = data.get('vacancies')
#             experience = data.get('experience')
#             job_location = data.get('job_location')  
#             role_type = data.get('role_type')  

            
#             print('Job Id:', job_id)
#             print('Jobtitle:', jobtitle)
#             print('Description:', description)
#             print('Vacancies:', vacancies)
#             print('Experience:', experience)
#             print('Job Location:', job_location)  
#             print('Role Type:', role_type)  
#             jobposting = Jobposting(
#                 job_id=job_id,
#                 jobtitle=jobtitle,
#                 description=description,
#                 vacancies=vacancies,
#                 experience=experience,
#                 job_location=job_location,  
#                 role_type=role_type,  
#             )
#             jobposting.save()

#             if not jobtitle or not description or not vacancies or not experience:
#                 return JsonResponse({'error_message': 'All fields are required for job posting'}, status=400)

#             return JsonResponse({'message': 'Job posting successful'})

#         except Exception as e:
#             # Print or log the specific exception for debugging
#             print(f"Error: {e}")
#             return JsonResponse({'error_message': str(e)}, status=500)

#     return JsonResponse({'error_message': 'Invalid request method'}, status=400)



from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
import json
from .models import Jobposting, Notification

@csrf_exempt
def JobPosting_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            job_id = data.get('job_id')
            jobtitle = data.get('jobtitle')
            description = data.get('description')
            vacancies = data.get('vacancies')
            experience = data.get('experience')
            job_location = data.get('job_location')  
            role_type = data.get('role_type')  

            print('Job Id:', job_id)
            print('Jobtitle:', jobtitle)
            print('Description:', description)
            print('Vacancies:', vacancies)
            print('Experience:', experience)
            print('Job Location:', job_location)  
            print('Role Type:', role_type)  
            
            jobposting = Jobposting(
                job_id=job_id,
                jobtitle=jobtitle,
                description=description,
                vacancies=vacancies,
                experience=experience,
                job_location=job_location,  
                role_type=role_type,  
            )
            jobposting.save()

            if not jobtitle or not description or not vacancies or not experience:
                return JsonResponse({'error_message': 'All fields are required for job posting'}, status=400)

            # Create a notification for the job posting
            notification_message = f"New job posted: {jobtitle}"
            notification = Notification(message=notification_message,role="Candidate")
            notification.save()

            return JsonResponse({'message': 'Job posting successful'})

        except Exception as e:
            # Print or log the specific exception for debugging
            print(f"Error: {e}")
            return JsonResponse({'error_message': str(e)}, status=500)

    return JsonResponse({'error_message': 'Invalid request method'}, status=400)
