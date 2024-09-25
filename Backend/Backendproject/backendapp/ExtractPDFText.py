from django.db import connection
from django.http import JsonResponse
import json
from .models import Jobposting
from rest_framework.views import APIView
from PyPDF2 import PdfReader
from .models import JobApplication
from .text_similarity import TextSimilarity
import logging
import nltk
nltk.download('punkt')
nltk.download('stopwords')

class ExtractPDFText(APIView):
    def post(self, request,applicant_id, *args, **kwargs):
        try:
            pdf_file = request.FILES.get('pdf_file')
            job_titles = request.data.get('job_titles')
            # applicant_id=request.data.get('applicant_id')
            job_titles = json.loads(job_titles)
            print("Job Titles:", job_titles)
           
            if pdf_file:
                with pdf_file as file:
                    pdf_reader = PdfReader(file)
                    page_nums = len(pdf_reader.pages)
                    extracted_text = []
                    for page_num in range(page_nums):
                        page = pdf_reader.pages[page_num]
                        text = page.extract_text()
                        extracted_text.append(text)
 
                # Fetch job description based on job title
                job_descriptions = [self.get_job_description(job_title) for job_title in job_titles]
                print("Job Descriptions:", job_descriptions)
                
                # Calculate similarity scores for each extracted text against each job description
                similarity_scores = []
                for job_description in job_descriptions:
                    job_scores = []
                    for text in extracted_text:
                        similarity_score = self.calculate_similarity(text, job_description)
                        job_scores.append(similarity_score)
                    similarity_scores.append(job_scores)
 
                    
                similarity_scores_tuples = [tuple(scores) for scores in similarity_scores]
                job_applications = JobApplication.objects.filter(applicant_id=applicant_id)
                job_applications_data = []
                for job_application in job_applications:
                    if job_application.job_title in job_titles:
                        job_applications_data.append({
                            'applicant_id': job_application.applicant_id,
                            'job_title': job_application.job_title,
                            'similarity_scores': similarity_scores_tuples[job_titles.index(job_application.job_title)]
                        })
                    
                        
               # Assuming 'connection' is your database connection object
                logger = logging.getLogger(__name__)

                try:
                    with connection.cursor() as cursor:
                        # Retrieve existing data from the database
                        cursor.execute("SELECT applicant_id, job_title FROM backendapp_jobapplicationscore ")
                        existing_records = cursor.fetchall()

                        for data in job_applications_data:
                            # Check if the data already exists in the table
                            if (data['applicant_id'], data['job_title']) in existing_records:
                                # If data exists, update the existing record
                                cursor.execute(
                                    "UPDATE backendapp_jobapplicationscore SET similarity_scores = %s WHERE applicant_id = %s AND job_title = %s",
                                    (data['similarity_scores'], data['applicant_id'], data['job_title'])
                                )
                                logger.info(f"Updated record for applicant {data['applicant_id']} and job title {data['job_title']}")
                            else:
                                # If data doesn't exist, insert new record
                                cursor.execute(
                                    "INSERT INTO backendapp_jobapplicationscore (applicant_id, job_title, similarity_scores) VALUES (%s, %s, %s)",
                                    (data['applicant_id'], data['job_title'], data['similarity_scores'])
                                )
                                logger.info(f"Inserted new record for applicant {data['applicant_id']} and job title {data['job_title']}")

                    # Commit changes after processing all records
                    connection.commit()

                except Exception as e:
                    # Log any exceptions that occur during database operations
                    logger.error(f"Error occurred: {e}")

                
                return JsonResponse({
                    'extracted_text': extracted_text,
                    'job_descriptions': job_descriptions,
                    'job_applications': job_applications_data
                })
                # return JsonResponse(response, safe=False)
            else:
                return JsonResponse({'error': 'No PDF file provided'}, status=400)
            
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
   
    @staticmethod
    def get_job_description(job_title):
        job_posting = Jobposting.objects.filter(jobtitle=job_title).first()
        if job_posting:
            return job_posting.description
        else:
            return "Job description not found"
   
    @staticmethod
    def calculate_similarity(extracted_text, job_description):
        text_similarity = TextSimilarity()
        similarity_score = text_similarity.text_similarity(extracted_text, job_description)
        return similarity_score