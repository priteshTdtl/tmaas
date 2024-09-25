# views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import InterviewEvaluation
from django.core.exceptions import ValidationError
import json
@csrf_exempt
def save_evaluation(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        candidate_email = data.get('candidateEmail')

        # Check if a record already exists for the candidate email
        if InterviewEvaluation.objects.filter(candidate_email=candidate_email).exists():
            return JsonResponse({'error': 'Evaluation already submitted for this candidate'}, status=400)

        evaluation = InterviewEvaluation(
            candidate=data['candidate'],
            candidate_email=data['candidateEmail'],
            educational_background=data['educationalBackground'],
            educational_background_comments=data['educationalBackgroundComments'],
            prior_work_experience=data['priorWorkExperience'],
            prior_work_experience_comments=data['priorWorkExperienceComments'],
            technical_qualifications=data['technicalQualifications'],
            technical_qualifications_comments=data['technicalQualificationsComments'],
            verbal_communication=data['verbalCommunication'],
            verbal_communication_comments=data['verbalCommunicationComments'],
            candidate_interest=data['candidateInterest'],
            candidate_interest_comments=data['candidateInterestComments'],
            knowledge_of_organization=data['knowledgeOfOrganization'],
            knowledge_of_organization_comments=data['knowledgeOfOrganizationComments'],
            teambuilding_interpersonal_skills=data['teambuildingInterpersonalSkills'],
            teambuilding_interpersonal_skills_comments=data['teambuildingInterpersonalSkillsComments'],
            initiative=data['initiative'],
            initiative_comments=data['initiativeComments'],
            time_management=data['timeManagement'],
            time_management_comments=data['timeManagementComments'],
            overall_impression=data['overallImpression'],
            overall_impression_comments=data['overallImpressionComments'],
        )
        evaluation.save()
        return JsonResponse({'message': 'Evaluation saved successfully'})
    else:
        return JsonResponse({'error': 'Invalid request method'})
