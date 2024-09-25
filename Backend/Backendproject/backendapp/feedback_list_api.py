
from django.http import JsonResponse
from .models import Feedback
from django.views.decorators.csrf import csrf_exempt
@csrf_exempt
def feedback_list_api(request):
    feedback_list = Feedback.objects.values('id', 'rating', 'feedback')
    return JsonResponse(list(feedback_list), safe=False)