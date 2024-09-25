from django.shortcuts import render
from rest_framework.response import Response
from django.contrib.auth.decorators import login_required
from .serializers import ApplicantSerializer
from django.db import IntegrityError
from rest_framework import status
from rest_framework.views import APIView
import nltk
nltk.download('punkt')
nltk.download('stopwords')
from rest_framework.decorators import api_view
from .models import Student
from .models import Applicant
from .serializers import ApplicantSerializer


class ApplicantCreateView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = ApplicantSerializer(data=request.data)
        if serializer.is_valid():
            try:
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except IntegrityError:
                return Response(
                    {"error": "Email already exists. Cannot fill the form twice."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class ApplicantDetailView(APIView):
    def get(self, request, applicant_id):
        try:
            applicant = Applicant.objects.get(id=applicant_id)
            serializer = ApplicantSerializer(applicant)
            return Response(serializer.data)
        except Applicant.DoesNotExist:
            return Response({"error": "Applicant not found"}, status=status.HTTP_404_NOT_FOUND)
        
@login_required
def protected_view(request):
    # Your view logic goes here
    return render(request, 'dashboard') 