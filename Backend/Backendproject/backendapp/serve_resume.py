from django.conf import settings
from django.shortcuts import get_object_or_404
import os
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.shortcuts import get_object_or_404
from .models import Applicant

def serve_resume(request, applicant_id):
    applicant = get_object_or_404(Applicant, id=applicant_id)

    # Extract the file name or path from the FieldFile
    resume_file_name = os.path.basename(applicant.resume.path)
 
    # Construct the full path to the resume file using os.path.join
    resume_path = os.path.join(settings.RESUME_FOLDER, resume_file_name)

    with open(resume_path, 'rb') as resume_file:
        response = HttpResponse(resume_file.read(), content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="{resume_file_name}"'
        return response
