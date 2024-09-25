from .models import Letters
from django.shortcuts import get_object_or_404
from django.http import FileResponse

def download_pdf(request):
    pdf_path = request.GET.get('pdfPath')
    letter = get_object_or_404(Letters, pdf_path=pdf_path)
    
    return FileResponse(open(letter.pdf_path.path, 'rb'), content_type='application/pdf')