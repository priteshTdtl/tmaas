from django.http import JsonResponse 
from .models import Feedback
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.contrib.auth.hashers import make_password
import json
import nltk
nltk.download('punkt')
nltk.download('stopwords')

@csrf_exempt
def feedback_api(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        rating = data.get('rating', '')
        feedback_text = data.get('feedback', '')
 
        # Debug print statements
        print('Rating:', rating)
        print('Feedback:', feedback_text)

        feedback = Feedback(rating=rating, feedback=feedback_text)
        feedback.save()

        return JsonResponse({'message': 'Feedback submitted successfully'})
    else:
        return JsonResponse({'error': 'Invalid request method'})