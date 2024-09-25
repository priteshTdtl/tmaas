from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from .models import Applicant
from django.shortcuts import get_object_or_404
from django.shortcuts import get_object_or_404
from .models import PersonalityResult
import nltk
nltk.download('punkt')
nltk.download('stopwords')

@csrf_exempt
def get_personality_results(request, applicant_id):
    if request.method == 'GET':
        try:
            applicant = get_object_or_404(Applicant, id=applicant_id)
            result = get_object_or_404(PersonalityResult, applicant=applicant)
            # Return the personality assessment data as JSON
            return JsonResponse({
                'extraversion': result.extraversion,
                'agreeableness': result.agreeableness,
                'openness': result.openness,
                'conscientiousness': result.conscientiousness,
                'neuroticism': result.neuroticism,
            })
        except PersonalityResult.DoesNotExist:
            return JsonResponse({'error': 'Personality results not found for the candidate.'}, status=404)
        except Applicant.DoesNotExist:
            return JsonResponse({'error': 'Applicant not found.'}, status=404)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)