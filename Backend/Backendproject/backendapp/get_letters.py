from django.http import JsonResponse
import json
from django.core.serializers import serialize
from .models import Letters
import nltk
nltk.download('punkt')
nltk.download('stopwords')
    
def get_letters(request):
    if request.method == 'GET':
        letters = Letters.objects.all()
        serialized_letters = serialize('json', letters)
        deserialized_letters = json.loads(serialized_letters)  
        return JsonResponse({'letters': deserialized_letters})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)