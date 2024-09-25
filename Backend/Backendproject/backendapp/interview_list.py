from django.http import JsonResponse
from .models import Interview

def interview_list(request):
    interviews = Interview.objects.all()
    data = [{'id': interview.id, 'candidate': interview.candidate, 'interviewer': interview.interviewer,'additional_members': interview.additional_members, 'date': interview.date, 'time': interview.time} for interview in interviews]
    return JsonResponse(data, safe=False)
