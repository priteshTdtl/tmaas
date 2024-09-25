
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Applicant
from .serializers import ApplicantSerializer  

@api_view(['POST'])
def get_applicant_data(request):
    email = request.data.get('email')
    if email:
        try:
            applicant = Applicant.objects.get(email=email)
            serializer = ApplicantSerializer(applicant)
            return Response(serializer.data)
        except Applicant.DoesNotExist:
            return Response({"error": "Applicant not found"}, status=404)
    else:
        return Response({"error": "Email parameter is required"}, status=400)

