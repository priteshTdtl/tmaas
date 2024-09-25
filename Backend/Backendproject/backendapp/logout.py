from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
@login_required
def logout_view(request):
    try:
        # Perform any additional logout-related actions if needed
        # ...

        # Logout the user
        logout(request)

        return JsonResponse({'message': 'Logout successful'})
    except Exception as e:
        return JsonResponse({'error_message': str(e)}, status=500)
