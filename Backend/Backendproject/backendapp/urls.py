from django.urls import path
from . import jobtitle, views,jobapplicationlist,update_applicant_status, feedback_api,feedback_list_api,get_students,create_student,read_student,update_student, delete_student, activate_student, deactivate_student
from .views import protected_view, ApplicantDetailView
from . import JobPosting_view, JobPostingresult_api,ApplicantList,ApplicantDetail,serve_resume,fetch_applicant_data,ExtractPDFText,update_applicant,save_personality_result,Withdraw_Applicaton
from . import login,signup,check_authentication,forgot_password,update_password,logout,userprofile, jobtitle,upload_profile_picture,get_profile_picture
from . import check_quiz_status, get_personality_results,get_job_applications, get_letters,save_pdf,download_pdf,schedule_interview,interview_list, count, delete_job_opening, save_evaluation
from . import extract_text, text_similarity,get_candidate_email, update_sent_status,send_offer_letter_email,get_candidate_names,notification,interviewer_list,interviewer_form,get_interviewers,interviewer_view_resume,interviewer_data,interviewers_get_job,interviewer_detail_list,InterviewerFeedback
from .offer_letter import letter

urlpatterns = [
    path('Signup_view/', signup.Signup_view, name='TMaaS_App'),
    path('jobtitle/', jobtitle.jobtitle, name='TMaaS_App'),
    path('Login_view/',login.Login_view,name="Login_view"),
    path('logout', logout.logout_view, name='logout'),
    path('check_authentication/', check_authentication.check_authentication, name='check_authentication'),
    path('forgot_password/', forgot_password.forgot_password, name='forgot_password'),  
    path('update_password/', update_password.update_password, name='update_password'),
    #
    path('dashboard/', protected_view, name='protected_view'),
    path('api/feedback/', feedback_api.feedback_api, name='feedback_api'),
    path('api/feedback-list/', feedback_list_api.feedback_list_api, name='feedback_list_api'),
    path('JobPosting_view/',JobPosting_view.JobPosting_view, name='Jobposting_view'),
    path('JobPostingresult_api/', JobPostingresult_api.JobPostingresult_api, name='JobPostingresult_api'),
    #crud
    path('students/', get_students.get_students),
    path('students/create/', create_student.create_student),
    path('students/read/<int:id>/', read_student.read_student),
    path('students/update/<int:pk>/', update_student.update_student),
    path('students/delete/<int:pk>/', delete_student.delete_student),
    path('students/activate/<int:pk>/', activate_student.activate_student_account, name='activate_student_account'),
    path('students/deactivate/<int:pk>/', deactivate_student.deactivate_student_account, name='deactivate_student_account'),

    path('applicants/', ApplicantList.ApplicantList.as_view(), name='applicant-list'),
    path('applicants/<int:applicant_id>/', ApplicantDetailView.as_view(), name='applicant-detail'),

    path('applicants/<int:pk>/', ApplicantDetail.ApplicantDetail.as_view(), name='applicant-detail'),
    path('api/resume/<int:applicant_id>/', serve_resume.serve_resume, name='serve_resume'),
    path('applicants/data/', fetch_applicant_data.fetch_applicant_data, name='fetch_applicant_data'),
    path('fetch_applicant_data/', fetch_applicant_data.fetch_applicant_data, name='fetch_applicant_data'),
    path('applicants/<int:user_id>/job-applications/', get_job_applications.get_job_applications),

    path('UserProfile/', userprofile.UserProfile,name="UserProfile"),
    path('upload-profile-picture/', upload_profile_picture.upload_profile_picture, name='upload_profile_picture'),
    path('profile-picture/<int:user_id>/', get_profile_picture.get_profile_picture, name='get_profile_picture'),

    path('extract-pdf-text/<int:applicant_id>', ExtractPDFText.ExtractPDFText.as_view(), name='extract_pdf_text'),
    path('text-similarity/', text_similarity.TextSimilarity.as_view(), name='text_similarity'),
    path('api/text-similarity/', text_similarity.TextSimilarity.as_view(), name='text_similarity_api'),
    path('update_applicant/', update_applicant.update_applicant, name='update_applicant'),
    path('applicants/update_status/<int:id>/', update_applicant_status.update_applicant_status),
    path('applicant/job-title/<int:applicant_id>/', jobapplicationlist.JobApplicationList.as_view(), name='job_application_list'),
    path('save_personality_result/', save_personality_result.save_personality_result, name='save_personality_result'),
    path('get_personality_results/<int:applicant_id>/', get_personality_results.get_personality_results, name='get_personality_results'),
    path('check_quiz_status/<int:user_id>/', check_quiz_status.check_quiz_status, name='check_quiz_status'),

    path('get_letters/', get_letters.get_letters, name='get_letters'),
    path('offer_letter/', letter, name='offer_letter'),
    path('schedule-interview/', schedule_interview.schedule_interview, name='schedule_interview'),
    path('interviews/', interview_list.interview_list, name='interview-list'),
    path('interviewers/', interviewer_list.interviewer_list, name='interview-list'),
    path('save_pdf/', save_pdf.save_pdf, name='save_pdf'),
    path('download_pdf/', download_pdf.download_pdf, name='download_pdf'),
    path('total_applicants/', count.total_applicants, name='total_applicants'),
    path('total_job_openings/', count.total_job_openings, name='total_job_openings'),
    path('job_application_status_counts/', count.job_application_status_counts, name='job_application_status_counts'),
    path('total_users/', count.total_users, name='total_users'),
    path('get_role_count/', count.get_role_count, name='get_role_count'),
    path('get_user_count_data/', count.get_user_count_data, name='get_user_count_data'),
    path('total_account_status/',count.total_account_status,name='total_account_status'),
    path('extract_text/', extract_text.extract_text, name='extract_text'),
    path('get_candidate_email/<str:candidate_name>/', get_candidate_email.get_candidate_email, name='get_candidate_email'),
    path('send_offer_letter_email/', send_offer_letter_email.send_offer_letter_email, name='send_offer_letter_email'),
    path('get_candidate_names/', get_candidate_names.get_candidate_names, name='get_candidate_names'),
    path('update_sent_status/<int:pk>/', update_sent_status.update_sent_status, name='update_sent_status'),
    path('job-applications/<int:job_app_id>/withdraw/', Withdraw_Applicaton.withdraw_job_application, name='withdraw_job_application'),
    path('list_users/', count.list_users, name='list_users'),
    path('get_applicant_names/', count.get_applicant_names, name='get_applicant_names'),
    path('get_interview_list/', count.get_interview_list, name='get_interview_list'),
    path('job_opening_list/', count.job_opening_list, name='job_opening_list'),
    path('HR_list/', count.HR_list, name='HR_list'),
    path('Interviewer_list/', count.Interviewer_list, name='Interviewer_list'),
    path('Candidate_list/', count.Candidate_list, name='Candidate_list'),  
    path('personality_list/', count.personality_list, name='personality_list'),   
    path('job_opening/<int:job_id>/', delete_job_opening.delete_job_opening, name='delete_job_opening'),
    path('get_notifications/', notification.get_notifications, name='get_notifications'),   
    path('get_interviewers/', get_interviewers.get_interviewers, name='get_interviewers'),
    path('get_applicant_data/', interviewer_data.get_applicant_data, name='get_applicant_data'),
    path('interviewer_details/', interviewer_form.interviewer_form, name='interviewer_form'),
    path('view_resume/', interviewer_view_resume.view_resume, name='view_resume'),
    path('get_applied_job/<str:candidate_email>/', interviewers_get_job.get_applied_job_for_interviewers, name='get_applied_job'),
    path('interviewer-details/', interviewer_detail_list.interviewer_detail_list, name='interviewer-detail-list'),
    path('save_evaluation/', save_evaluation.save_evaluation, name='save_evaluation'),
    path('interview-evaluations/', InterviewerFeedback.InterviewEvaluationListView.as_view(), name='interview-evaluations'),

]