import json
from django.http import JsonResponse
from django.db import connection, IntegrityError
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone

@csrf_exempt
def letter(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))  
        candidate_name = data.get('candidateName')
        position = data.get('position')
        salary = data.get('salary')
        LetterType = data.get('section') 
        Time = timezone.now()  
        
        if LetterType == 'Offer Letter':
            offer_letter = f"Dear {candidate_name},\n\nWe are pleased to offer you the position of {position} at our company.\n\nSalary: ${salary}\n\nSincerely,\n[Your Company Name]"

            with connection.cursor() as cursor:
                cursor.execute(
                    "INSERT INTO backendapp_letters (candidate_name, position, salary, letter,LetterType,Time) VALUES (%s, %s, %s, %s,%s,%s)",
                    [candidate_name, position, salary, offer_letter,LetterType,Time]
                )
            
            return JsonResponse({'message': 'Offer letter saved successfully'})
        elif LetterType == 'Rejection Letter':
            rejection_letter = f"Dear {candidate_name},\n\nWe regret to inform you that we cannot offer you the position of {position} at our company at this time.\n\n\n\nSincerely,\n[Your Company Name]"

            with connection.cursor() as cursor:
                cursor.execute(
                    "INSERT INTO backendapp_letters (candidate_name, position, letter,LetterType,Time) VALUES (%s, %s, %s, %s,%s)",
                    [candidate_name, position, rejection_letter,LetterType,Time]
                )

            return JsonResponse({'message': 'Rejection letter saved successfully'})
        else:
            return JsonResponse({'error': 'Invalid letter type'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

