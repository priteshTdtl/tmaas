
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Applicant
from django.http import HttpResponse
from django.core import serializers

@csrf_exempt
def fetch_applicant_data(request):
    if request.method == 'GET':
        try:
            user_id = request.GET.get('user_id')
            applicant = Applicant.objects.get(user_id=user_id)
            applicant_data = serializers.serialize('json', [applicant,])
            return HttpResponse(applicant_data, content_type='application/json')
        except Applicant.DoesNotExist:
            return JsonResponse({'error': 'Applicant not found'}, status=404)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)
