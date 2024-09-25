from rest_framework import generics
from .models import Applicant
from .serializers import ApplicantSerializer

class ApplicantList(generics.ListCreateAPIView):
    queryset = Applicant.objects.all()
    serializer_class = ApplicantSerializer