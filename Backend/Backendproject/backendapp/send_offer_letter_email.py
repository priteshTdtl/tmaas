from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.mail import EmailMessage
import requests

@api_view(['POST'])
def send_offer_letter_email(request):
    try:
        candidate_name = request.data.get('candidate_name')
        pdf_path = request.data.get('pdf_path')
        letter_type = request.data.get('letter_type')  
 
        email_response = requests.get(f'http://127.0.0.1:8000/get_candidate_email/{candidate_name}/')
        email_data = email_response.json()
        candidate_email = email_data.get('email')
 
        if letter_type == 'Offer Letter':
            subject = 'Subject: Your Offer Letter'
            body = f'''Dear {candidate_name},
 
Congratulations!
 
Your skills and experience make you an ideal fit for our team, and we are excited about the contributions you will make to our organization.
 
Please find attached your official offer letter detailing your compensation, benefits, start date, and other relevant information. If you have any questions or need further clarification, feel free to contact us.
 
We look forward to welcoming you aboard and wish you great success in your new role.
 
Best regards,
Talent Acquisition Team
TDTL
'''
           
            email = EmailMessage(
                subject=subject,
                body=body,
                from_email='pr@thedatatechlabs.com',
                to=[candidate_email],
            )
            email.attach_file(pdf_path, 'application/pdf')
            email.send()
        elif letter_type == 'Rejection Letter':
            subject = 'Subject: Your Rejection Letter'
            body = f'''Dear {candidate_name},
We sincerely appreciate the time and effort you put into your application and want to thank you for your interest in joining our team. We encourage you to apply for future opportunities that align with your skills and experience.
 
We regret to inform you that after careful consideration, we have decided not to move forward with your application.
 
While we received many strong applications, we ultimately selected a candidate whose qualifications and experience more closely match the needs of the role at this time.
 
Thank you once again for considering. We wish you all the best in your future endeavors.
 
Best regards,
Talent Acquisition Team
TDTL
'''
           
            email = EmailMessage(
                subject=subject,
                body=body,
                from_email='pr@thedatatechlabs.com',
                to=[candidate_email],
            )
            email.send()
        else:
            subject = 'Subject: Custom Letter'
            body = 'Body of the custom letter email here.'
 
            email = EmailMessage(
                subject=subject,
                body=body,
                from_email='pr@tdtl.world',
                to=[candidate_email],
            )
            email.send()
 
        return Response({'message': 'Email sent successfully'})
    except requests.exceptions.RequestException as request_error:
        return Response({'error': f'Error fetching candidate email: {str(request_error)}'}, status=500)
    except Exception as e:
        return Response({'error': str(e)}, status=500)