from django.http import JsonResponse
from .models import Student

def get_candidate_names(request):
 
    candidates = Student.objects.all().values_list('name', flat=True)
    candidate_names = list(candidates)
    return JsonResponse({'candidate_names': candidate_names})