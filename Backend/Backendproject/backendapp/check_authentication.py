from django.http import JsonResponse

def check_authentication(request):
    try:
        if request.user.is_authenticated:
            
            user_info = {
                # 'user_id': request.user.id,
                'email': request.user.email,
            }
            return JsonResponse({'authenticated': True, 'user': user_info})
        else:
            return JsonResponse({'authenticated': False})

    except Exception as e:
        return JsonResponse({'error_message': 'An error occurred while checking authentication'}, status=500)
