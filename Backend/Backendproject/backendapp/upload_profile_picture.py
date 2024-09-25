from django.http import JsonResponse
from django.db import connection
from django.db import transaction
from django.views.decorators.csrf import csrf_exempt
from .models import Student
from django.conf import settings

@csrf_exempt
def upload_profile_picture(request):
    if request.method == 'POST' and request.FILES.get('profile_picture'):
        profile_picture = request.FILES['profile_picture']
        user_id = request.POST.get('user_id')

        try:
            user = Student.objects.get(id=user_id)
            user.profile_picture = profile_picture               
            user.save()

            # Construct the URL for accessing the uploaded picture
            profile_picture_url =  profile_picture.name

            return JsonResponse({'profile_picture_url': profile_picture_url}, status=200)
        except Student.DoesNotExist:
            return JsonResponse({'error': 'User does not exist'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'No profile picture provided'}, status=400)