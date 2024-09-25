from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt 
from .models import Interview
import json

@csrf_exempt 
def interviewer_list(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email', None)
        if email:
            interviews = Interview.objects.filter(interviewer_email=email)
            data = [{'id': interview.id, 'candidate': interview.candidate, 'interviewer': interview.interviewer, 'additional_members': interview.additional_members, 'date': interview.date, 'time': interview.time,'interviewer_email': interview.interviewer_email,'candidate_email': interview.candidate_email , "meetLink":interview.meetLink} for interview in interviews]
            return JsonResponse(data, safe=False)
        else:
            return JsonResponse({'error': 'Email not provided'}, status=400)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)
