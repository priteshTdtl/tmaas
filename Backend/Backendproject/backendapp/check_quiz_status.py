from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import PersonalityResult
import nltk
nltk.download('punkt')
nltk.download('stopwords')

@csrf_exempt
def check_quiz_status(request, user_id):
    try:
        result = PersonalityResult.objects.get(applicant__user_id=user_id)
        quiz_taken = result.quiz_taken
        return JsonResponse({'quiz_taken': quiz_taken})
    except PersonalityResult.DoesNotExist:
        # Handle the case when the user_id is not found
        return JsonResponse({'error': 'User not found'}, status=404)