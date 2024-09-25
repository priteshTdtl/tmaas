from rest_framework import serializers
from .models import Student, Applicant
from rest_framework.response import Response
from rest_framework import status
from django.db import IntegrityError
from .models import JobApplication
from .models import Interview
from .models import JobApplication, JobApplicationScore, InterviewerDetails

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'

        
class ApplicantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Applicant
        fields = '__all__'

class ScoreSerializer(serializers.ModelSerializer):  
    similarly_score = serializers.FloatField()
    class Meta:
        model = JobApplication
        fields = '__all__'
    applicant = serializers.IntegerField(source='applicant_id')
    
class JobApplicationSerializer(serializers.ModelSerializer):  
    # similarly_score = serializers.FloatField()
    class Meta:
        model = JobApplication
        fields = '__all__'

class InterviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interview
        fields = '__all__'
        
class InterviewerDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterviewerDetails
        fields = '__all__'
from rest_framework import serializers
from .models import InterviewEvaluation

class InterviewEvaluationSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterviewEvaluation
        fields = '__all__'
