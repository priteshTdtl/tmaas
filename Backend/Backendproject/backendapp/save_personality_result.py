from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
import json
from .models import Applicant
from django.shortcuts import get_object_or_404
from django.shortcuts import get_object_or_404
from .models import PersonalityResult
from .personality_quiz import PersonalityQuiz

import nltk
nltk.download('punkt')
nltk.download('stopwords')

@csrf_exempt
def save_personality_result(request):
    if request.method == 'POST':
        data = json.loads(request.body)  # Parse JSON data

        if not data:
            return JsonResponse({'error':'Please provide valid data'})
        print("Data:", data)

        # Retrieve user_id from the data
        user_id_from_data = data.get('user_id')
        if not user_id_from_data:
            return JsonResponse({'error': 'user_id is required in the data.'}, status=400)

        # Validate user_id against the corresponding Applicant
        applicant = get_object_or_404(Applicant, user_id=user_id_from_data)

        # Check if the quiz has already been taken
        existing_result = PersonalityResult.objects.filter(applicant=applicant).first()
        if existing_result and existing_result.quiz_taken:
            return JsonResponse({'error': 'Quiz already taken. Cannot start a new quiz.'}, status=400)

        # Use the existing PersonalityQuiz logic
        quiz = PersonalityQuiz()
        for trait, trait_answers in data.get('answers', {}).items():
            for index, answer in enumerate(trait_answers, start=1):
                answer = int(answer)
                while answer not in [1, 2, 3, 4, 5]:
                    return JsonResponse({'error': 'Invalid response. Please choose a number between 1 and 5.'}, status=400)
                quiz.personality_traits[trait] += answer
                print("Quiz:", quiz.personality_traits[trait])

        # Save the results to the PersonalityResult model
        result, created = PersonalityResult.objects.get_or_create(applicant=applicant)

        # Update the PersonalityResult with the new quiz results
        result.extraversion = quiz.personality_traits["extraversion"]
        result.agreeableness = quiz.personality_traits["agreeableness"]
        result.openness = quiz.personality_traits["openness"]
        result.conscientiousness = quiz.personality_traits["conscientiousness"]
        result.neuroticism = quiz.personality_traits["neuroticism"]

        # Mark the quiz as taken
        result.quiz_taken = True
        result.save()

        return JsonResponse({'message': 'Personality results saved successfully.', 'result_id': result.user_id})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)