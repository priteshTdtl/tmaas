from django.http import JsonResponse
from .models import Applicant,Interview
from .models import Jobposting, JobApplication, Student, PersonalityResult
from django.db.models import Count
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models.functions import ExtractMonth
from .serializers import StudentSerializer
from datetime import datetime


def total_job_openings(request):
    total_openings_count = Jobposting.objects.count()
    return JsonResponse({'total_job_openings': total_openings_count})

def job_application_status_counts(request):
    status_counts = JobApplication.objects.values('job_status').annotate(count=Count('id'))
    counts_dict = {status['job_status']: status['count'] for status in status_counts}
    return JsonResponse({'status_counts': counts_dict})

def total_applicants(request):
    total_applicants_count =  Applicant.objects.exclude(resume__isnull=True).exclude(resume__exact='').count()
    return JsonResponse({'total_applicants': total_applicants_count})

def total_users(request):
    total_users=Student.objects.count()
    return JsonResponse({'total_users': total_users})

@api_view(['GET'])
def get_role_count(request):
    role_counts = {
        'Candidate': Student.objects.filter(role='Candidate').count(),
        'HR': Student.objects.filter(role='HR').count(),
        'Admin': Student.objects.filter(role='Admin').count(),
        'Interviewer': Student.objects.filter(role='Interviewer').count(),
    }
    return Response({'status_counts': role_counts})


def get_user_count_data(request):
    try:
        # Aggregate user counts month-wise
        user_counts = Student.objects.annotate(
            month=ExtractMonth('created_at')
        ).values('month').annotate(count=Count('id')).order_by('month')

        # Serialize the data
        data = [{'month': entry['month'], 'count': entry['count']} for entry in user_counts]

        return JsonResponse({'user_counts': data})

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


def total_account_status(request):
    active_users_count = Student.objects.filter(account_status='active').count()
    inactive_users_count = Student.objects.filter(account_status='inactive').count()
    return JsonResponse({'active_users': active_users_count, 'inactive_users': inactive_users_count})

@api_view(['GET'])
def list_users(request):
    users = Student.objects.filter(role='candidate').values_list('name', 'created_at', 'id')
    user_list = []
    for name, created_at, user_id in users:
        resume_exists = Applicant.objects.filter(user_id=user_id).exclude(resume__isnull=True).exclude(resume__exact='')
        status = "YES" if resume_exists else "NO"
        formatted_date = datetime.strftime(created_at, "%d-%m-%Y")  # Convert date format
        user_list.append({'name': name, 'created_at': formatted_date, 'status': status})
    return Response(user_list)

@api_view(['GET'])
def get_applicant_names(request):
    applicants = Applicant.objects.filter(resume__isnull=False).values_list('first_name', 'last_name')
    applicant_list = [{'first_name': first_name, 'last_name': last_name} for first_name, last_name in applicants]
    return Response(applicant_list)

@api_view(['GET'])
def get_interview_list(request):
    applicants = Interview.objects.values_list('candidate','date')
    Interview_list=[{'candidate':candidate, 'date':date}for candidate,date in applicants]
    return Response(list(Interview_list))


@api_view(['GET'])
def job_opening_list(request):
    job_openings = Jobposting.objects.values_list('jobtitle', 'created_at', 'job_id').annotate(applicant_count=Count(JobApplication.job_title))

    job_opening_list = []
    for job_title, created_at, job_id, applicant_count in job_openings:
        formatted_date = datetime.strftime(created_at, "%d-%m-%Y")  # Convert date format
        job_opening_list.append({
            'jobtitle': job_title,
            'created_at': formatted_date,
            'job_id': job_id,
            'applicant_count': applicant_count,
        })

    return Response(job_opening_list)

@api_view(['GET'])

def HR_list(request):
    HR_list=Student.objects.filter(role='HR').values_list('name', flat=True)
    return Response(HR_list)

@api_view(['GET'])

def Interviewer_list(request):
    Interviewer_list=Student.objects.filter(role='Interviewer').values_list('name', flat=True)
    return Response(Interviewer_list)

@api_view(['GET'])

def Candidate_list(request):
    Candidate_list=Student.objects.filter(role='Candidate').values_list('name', flat=True)
    return Response(Candidate_list)

@api_view(["GET"])
def personality_list(request):
    # Retrieve personality results for all applicants
    users = PersonalityResult.objects.values('applicant_id', 'quiz_taken', 'neuroticism', 'conscientiousness', 'openness', 'extraversion', 'agreeableness')

    personality_list = []
    for user in users:
        applicant_id = user['applicant_id']
        student_names = Student.objects.filter(id=applicant_id).values_list('name', flat=True)

        # Find the maximum score among all personality traits
        max_score = max(user.values())  # Find the maximum score
        max_traits = [trait for trait, score in user.items() if score == max_score and trait != 'applicant_id' and trait != 'quiz_taken']

        # Append the applicant's information along with the personality traits having the maximum score
        for name in student_names:
            personality_list.append({
                'applicant_id': applicant_id,
                'name': name,
                'quiz_taken': user['quiz_taken'],
                'max_personality': max_traits,
                'max_score': max_score
            })

    return Response(personality_list)
        