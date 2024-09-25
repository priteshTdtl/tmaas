from django.http import JsonResponse
from .models import Notification
def get_notifications(request):
    if request.method == 'GET':
        role = request.GET.get('role')  
        if role: 
            notifications = Notification.objects.filter(role=role).order_by('-time')  
            notification_data = [{'message': notification.message, 'time': notification.time} for notification in notifications]
            return JsonResponse({'notifications': notification_data})
        else:
            return JsonResponse({'error': 'Role parameter is missing'}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=400)
