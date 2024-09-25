from django.db import connection
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def UserProfile(request):
    if request.method == 'POST':
        try:
            # Get id from POST data
            data = json.loads(request.body.decode('utf-8'))
            email = data.get('email')

            # If id is provided, fetch data based on it
            if id is not None:
                # Use a raw SQL query with a cursor to fetch data from the 'users' table
                with connection.cursor() as cursor:
                    cursor.execute("SELECT id,name, email FROM backendapp_student WHERE email=%s", [email])
                    user_data = cursor.fetchone()

                    if user_data:
                        columns = [col[0] for col in cursor.description]
                        user_dict = dict(zip(columns, user_data))
                        return JsonResponse({'message': 'Data successfully fetched from the database', 'user_data': user_dict})
                    else:
                        return JsonResponse({'message': 'User not found in the database.'}, status=404)
            else:
                return JsonResponse({'message': 'Missing id parameter in the request.'}, status=400)

        except Exception as e:
            return JsonResponse({'message': str(e)}, status=500)

    else:
        return JsonResponse({'message': 'Invalid request method'}, status=405)

