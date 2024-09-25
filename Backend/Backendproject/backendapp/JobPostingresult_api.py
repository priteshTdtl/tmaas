from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Jobposting


@csrf_exempt
def JobPostingresult_api(request):
    jobposting_list = Jobposting.objects.values('id', 'job_id', 'jobtitle', 'description', 'vacancies', 'experience', 'job_location', 'role_type', 'created_at')
    return JsonResponse(list(jobposting_list), safe=False)