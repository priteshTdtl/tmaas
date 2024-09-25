from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from .models import Jobposting  # Make sure this import matches your model's name
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
@require_http_methods(["DELETE"])
def delete_job_opening(request, job_id):
    try:
        # Find the job posting by ID and delete it
        job = Jobposting.objects.get(job_id=job_id)  # Use the correct field name for job_id
        job.delete()
        return JsonResponse({'message': 'Job opening deleted successfully!'}, status=200)
    except Jobposting.DoesNotExist:
        # If the job doesn't exist, return an error message
        return JsonResponse({'message': 'Job opening not found.'}, status=404)
    except Exception as e:
        # If there's any other error, return an error message
        return JsonResponse({'message': str(e)}, status=500)
