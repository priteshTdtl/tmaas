from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Student
from rest_framework import status
from .serializers import InterviewSerializer
import nltk
nltk.download('punkt')
nltk.download('stopwords')

@api_view(['POST'])
def schedule_interview(request):
    if request.method == 'POST':
        serializer = InterviewSerializer(data=request.data)
        if serializer.is_valid():
            additional_members = request.data.get('additionalMembers', [])
            serializer.validated_data['additional_members'] = additional_members
            interviewer_email = request.data.get('interviewerEmail', '')
            serializer.validated_data['interviewer_email'] = interviewer_email
            candidate_email = request.data.get('candidateEmail', '')
            serializer.validated_data['candidate_email'] = candidate_email

            interview_instance = serializer.save()

            # Fetch email addresses for candidate, interviewer, and additional members
            candidate_emails = [Student.objects.get(name=interview_instance.candidate).email]
            interviewer_emails = [Student.objects.get(name=interview_instance.interviewer).email]
            additional_member_emails = [Student.objects.get(name=member).email for member in additional_members]

            # Combine all email addresses
            recipients = candidate_emails + interviewer_emails + additional_member_emails

            # Render the HTML message using Django template
            context = {
                'interview_instance': interview_instance,
            }
            message = render_to_string('interview_invitation.html', context)


            # Send email to candidate and interviewer
            subject = 'Interview Details'
            send_mail(subject, '', settings.DEFAULT_FROM_EMAIL, recipients, html_message=message)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)