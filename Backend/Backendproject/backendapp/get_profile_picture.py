from django.http import HttpResponse
from PIL import Image
from io import BytesIO
from .models import Student

def get_profile_picture(request, user_id):
    try:
        user = Student.objects.get(id=user_id)
        if user.profile_picture:
            # Assuming profile_picture is an ImageField or FileField in your User model
            profile_picture = user.profile_picture
            # Open the image using PIL
            img = Image.open(profile_picture)
            # Get the content type based on the image format
            content_type = f"image/{img.format.lower()}"
            # Create a BytesIO buffer to hold the image data
            buffer = BytesIO()
            # Save the image to the buffer in the appropriate format
            img.save(buffer, format=img.format)
            # Seek to the beginning of the buffer
            buffer.seek(0)
            # Return the image data as the response with the appropriate content type
            return HttpResponse(buffer, content_type=content_type)
        else:
            return HttpResponse("Profile picture not found for this user.", status=404)
    except Student.DoesNotExist:
        return HttpResponse("User does not exist.", status=404)