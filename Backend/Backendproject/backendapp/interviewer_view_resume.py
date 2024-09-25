from django.http import HttpResponse, JsonResponse
from django.views.decorators.http import require_POST
from django.core.exceptions import ObjectDoesNotExist
from django.views.decorators.csrf import csrf_exempt
from .models import Applicant
import json

@require_POST
@csrf_exempt
def view_resume(request):
    data = json.loads(request.body)
    candidate_email = data.get('email')

    print("Received email:", candidate_email)

    try:
        applicant = Applicant.objects.get(email=candidate_email)
        resume_content = applicant.resume.read()
        # Assuming the resume is stored in a FileField in the Applicant model
        
        response = HttpResponse(resume_content, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="{candidate_email}_resume.pdf"'
        return response
    except ObjectDoesNotExist:
        return JsonResponse({'error': 'Applicant not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

