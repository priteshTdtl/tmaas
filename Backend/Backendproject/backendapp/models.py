from django.db import models
from django.utils import timezone
from django.core.validators import EmailValidator
 
class Student(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    created_at = models.DateTimeField(default=timezone.now)
    profile_picture = models.ImageField(upload_to='media/', null=True, blank=True)
    account_status = models.CharField(max_length=20, default='Active')
    created_by=models.CharField(max_length=20, default='user')
    last_login = models.DateTimeField(blank=True, null=True)
 
    def __str__(self):
        return self.name
   
class Feedback(models.Model):
    RATING_CHOICES = [
        ('very_good', 'Very Good'),
        ('good', 'Good'),
        ('mediocre', 'Mediocre'),
        ('bad', 'Bad'),
        ('very_bad', 'Very Bad'),
    ]
 
    rating = models.CharField(max_length=20, choices=RATING_CHOICES)
    feedback = models.TextField()
 
    def __str__(self):
        return f'{self.get_rating_display()} - {self.feedback}'
 
class Jobposting(models.Model):
    job_id = models.CharField(max_length=100)
    jobtitle = models.CharField(max_length=255)
    description = models.TextField()
    vacancies = models.PositiveIntegerField()
    experience = models.CharField(max_length=255)
    job_location = models.CharField(max_length=255, default='Unknown')
    role_type = models.CharField(max_length=255, default='Unknown')
    created_at = models.DateTimeField(auto_now_add=True) 
 
    def __str__(self):
        return self.jobtitle
 
JOB_STATUS_CHOICES = [
    ('applied', 'Applied'),
    ('under_review', 'Under Review'),
    ('interview_scheduled', 'Interview Scheduled'),
    ('selected', 'Selected'),
    ('rejected', 'Rejected'),
]
 
class Applicant(models.Model):
    user = models.ForeignKey(Student, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=100, null=True)
    last_name = models.CharField(max_length=100, null=True)
    email = models.EmailField()
    phone = models.CharField(max_length=10, null=True)
    resume = models.FileField(upload_to='resumes/', null=True)
    address_type = models.CharField(max_length=10, choices=[('home', 'Home'), ('other', 'Other')], null=True)
    street_address = models.CharField(max_length=255, null=True)
    city = models.CharField(max_length=100, null=True)
    country = models.CharField(max_length=100, null=True)
    state = models.CharField(max_length=100, null=True)
    zip_code = models.CharField(max_length=10, null=True)
    relocating = models.CharField(max_length=3, choices=[('yes', 'Yes'), ('no', 'No')], null=True)
    employed_with_datetech = models.CharField(max_length=3, choices=[('yes', 'Yes'), ('no', 'No')], null=True)
    employee_id = models.CharField(max_length=20, blank=True, null=True)
    birthdate = models.DateField(null=True)
    employed_with_govt = models.CharField(max_length=3, choices=[('yes', 'Yes'), ('no', 'No')], null=True)
    how_did_you_hear = models.CharField(max_length=20, null=True)
    specify_hear = models.CharField(max_length=100, blank=True, null=True)
    degree = models.CharField(max_length=50, null=True)  
    specify_degree = models.CharField(max_length=50, blank=True, null=True)
    college = models.CharField(max_length=100, null=True)
    branch = models.CharField(max_length=50, null=True)
    graduation_date = models.DateField(null=True)
    country_of_college = models.CharField(max_length=100, null=True)
    city_of_college = models.CharField(max_length=100, null=True)
    state_of_college = models.CharField(max_length=100, null=True)
    nationality = models.CharField(max_length=50, null=True)
    authorized_to_work = models.CharField(max_length=3, choices=[('yes', 'Yes'), ('no', 'No')], null=True)
    require_visa_sponsorship = models.CharField(max_length=3, choices=[('yes', 'Yes'), ('no', 'No')], null=True)
    employer = models.CharField(max_length=100, null=True)
    work_city = models.CharField(max_length=100, null=True)
    work_country = models.CharField(max_length=100, null=True)
    work_state = models.CharField(max_length=100, null=True)
    job_title = models.CharField(max_length=100, null=True)
    work_start_date = models.DateField(null=True)
    work_end_date = models.DateField(null=True)
    work_description = models.TextField(null=True)
    reason_for_leaving = models.TextField(null=True)
    current_ctc = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    total_experience_months = models.IntegerField(null=True)
    current_notice_period_days = models.IntegerField(null=True)
    skills = models.TextField(null=True)
    timezone = models.CharField(max_length=50,null=True)


class PersonalityResult(models.Model):
    user_id = models.AutoField(primary_key=True)
    applicant = models.ForeignKey(Applicant, on_delete=models.CASCADE, related_name='personality_result')
    extraversion = models.IntegerField(default=0)
    agreeableness = models.IntegerField(default=0)
    openness = models.IntegerField(default=0)
    conscientiousness = models.IntegerField(default=0)
    neuroticism = models.IntegerField(default=0)
    quiz_taken = models.BooleanField(default=False) 
 
    
class JobApplication(models.Model):
    applicant = models.ForeignKey(Applicant, on_delete=models.CASCADE)
    job_title = models.CharField(max_length=100)
    job_status = models.CharField(max_length=100, choices=JOB_STATUS_CHOICES, default='Applied')
    status_update_time = models.DateTimeField(null=True, blank=True)
    applied_date = models.DateTimeField(null=True, blank=True)
    email = models.EmailField(null=True)

 
class Letters(models.Model):
    user_id  = models.IntegerField(default=None, null=True)
    candidate_name = models.TextField()
    position = models.TextField()
    salary = models.CharField(max_length=225)
    letter = models.TextField()
    LetterType = models.CharField(max_length=30)
    Time = models.DateTimeField(auto_now_add=True)
    pdf_path = models.FileField(upload_to='letters/')
    sent = models.BooleanField(default=False) 
    def __str__(self):
        return f"{self.candidate_name} - {self.LetterType} - Sent: {self.sent}"

class Interview(models.Model):
    candidate = models.CharField(max_length=100)
    interviewer = models.CharField(max_length=100)
    additional_members = models.JSONField(default=list) 
    meetLink  = models.URLField(max_length=1000)
    date = models.DateField()
    time = models.TimeField()
    # interviewer_email = models.EmailField(validators=[EmailValidator()], blank=True)
    interviewer_email = models.EmailField(null=True)
    candidate_email = models.EmailField(null=True)

class JobApplicationScore(models.Model):
    applicant_id = models.IntegerField()
    job_title = models.CharField(max_length=255)
    similarity_scores = models.FloatField()

    class Meta:
        # This ensures that each combination of applicant_id and job_title is unique
        unique_together = ('applicant_id', 'job_title')

class Notification(models.Model):
    message = models.TextField()
    time = models.DateTimeField(default=timezone.now)
    role = models.CharField(max_length=255, default='Unknown')

    def __str__(self):
        return f"Notification for {self.job.jobtitle}"        

class InterviewerDetails(models.Model):
    name = models.CharField(max_length=100)
    employee_id = models.CharField(max_length=20)
    phone = models.CharField(max_length=15)
    email = models.EmailField()
    skills = models.CharField(max_length=100)
    experience = models.CharField(max_length=50)
class InterviewEvaluation(models.Model):
    CANDIDATE_RATING_CHOICES = (
        (5, 'Exceptional'),
        (4, 'Above Average'),
        (3, 'Average'),
        (2, 'Satisfactory'),
        (1, 'Unsatisfactory')
    )

    candidate = models.CharField(max_length=100)
    candidate_email = models.EmailField(null=True)
    educational_background = models.IntegerField(choices=CANDIDATE_RATING_CHOICES)
    educational_background_comments = models.TextField()
    prior_work_experience = models.IntegerField(choices=CANDIDATE_RATING_CHOICES)
    prior_work_experience_comments = models.TextField()
    technical_qualifications = models.IntegerField(choices=CANDIDATE_RATING_CHOICES)
    technical_qualifications_comments = models.TextField()
    verbal_communication = models.IntegerField(choices=CANDIDATE_RATING_CHOICES)
    verbal_communication_comments = models.TextField()
    candidate_interest = models.IntegerField(choices=CANDIDATE_RATING_CHOICES)
    candidate_interest_comments = models.TextField()
    knowledge_of_organization = models.IntegerField(choices=CANDIDATE_RATING_CHOICES)
    knowledge_of_organization_comments = models.TextField()
    teambuilding_interpersonal_skills = models.IntegerField(choices=CANDIDATE_RATING_CHOICES)
    teambuilding_interpersonal_skills_comments = models.TextField()
    initiative = models.IntegerField(choices=CANDIDATE_RATING_CHOICES)
    initiative_comments = models.TextField()
    time_management = models.IntegerField(choices=CANDIDATE_RATING_CHOICES)
    time_management_comments = models.TextField()
    overall_impression = models.IntegerField(choices=CANDIDATE_RATING_CHOICES)
    overall_impression_comments = models.TextField()

    def __str__(self):
        return f"Evaluation for {self.candidate}"
    class Meta:
        unique_together = ('candidate_email',)
