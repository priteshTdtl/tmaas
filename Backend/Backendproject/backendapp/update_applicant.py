from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Applicant
import nltk
nltk.download('punkt')
nltk.download('stopwords')

@csrf_exempt
def update_applicant(request):
    if request.method == 'POST':
        try:
            data = request.POST.dict()
            user_id = data.get('user_id')
 
            applicant = Applicant.objects.get(user_id=user_id)
            for key, value in data.items():
                setattr(applicant, key, value)

            # Handle resume file
            if 'resume' in request.FILES:
                resume_file = request.FILES['resume']
                applicant.resume.save(resume_file.name, resume_file, save=True)
 
            applicant.save()
 
            return JsonResponse({'message': 'Applicant information updated successfully', 'user_id': user_id})
 
        except Exception as e:
            # Handle exceptions
            return JsonResponse({'error_message': str(e)}, status=500)
 
    return JsonResponse({'error_message': 'Invalid request method'}, status=400)
