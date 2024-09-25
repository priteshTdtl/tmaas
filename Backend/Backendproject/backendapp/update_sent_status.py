
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import Letters
import nltk
nltk.download('punkt')
nltk.download('stopwords')

 
@csrf_exempt
def update_sent_status(request, pk):
    if request.method == 'PUT':
        try:
       
            data = json.loads(request.body.decode('utf-8'))
            sent_status = data.get('sent', False)
           
            letter = Letters.objects.get(pk=pk)
            letter.sent = sent_status
            letter.save()
 
            return JsonResponse({'message': 'Sent status updated successfully'})
        except Letters.DoesNotExist:
            return JsonResponse({'error': 'Letter not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)