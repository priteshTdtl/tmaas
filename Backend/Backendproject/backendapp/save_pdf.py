from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Letters

@api_view(["POST"])
def save_pdf(request):
    pdf_file = request.FILES.get("pdf")
    last_entry = Letters.objects.last()

    if last_entry:
        last_entry.pdf_path = pdf_file
        last_entry.save()
        return Response({"message": "PDF saved successfully for the last entry"}, status=status.HTTP_200_OK)
    else:
        return Response({"error": "No entry found in the database"}, status=status.HTTP_404_NOT_FOUND)