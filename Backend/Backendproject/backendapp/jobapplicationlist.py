from django.db import connection
from rest_framework.response import Response
from rest_framework import generics
from .models import JobApplication
from .serializers import ScoreSerializer
import nltk
nltk.download('punkt')
nltk.download('stopwords')

class JobApplicationList(generics.ListAPIView):
    serializer_class = ScoreSerializer

    def get_queryset(self):
        applicant_id = self.kwargs['applicant_id']
        return JobApplication.objects.filter(applicant_id=applicant_id)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        raw_query = '''
            SELECT ja.id, ja.applicant_id, ja.job_title, ja.job_status, ja.applied_date, ss.similarity_scores AS similarly_score
            FROM backendapp_jobapplication ja
            LEFT JOIN backendapp_jobapplicationscore ss ON ja.job_title = ss.job_title AND ja.applicant_id = ss.applicant_id
            WHERE ja.applicant_id = %s
        '''

        with connection.cursor() as cursor:
            cursor.execute(raw_query, [self.kwargs['applicant_id']])
            result_list = []
            columns = [col[0] for col in cursor.description]

            for row in cursor.fetchall():
                result_list.append(dict(zip(columns, row)))

        serializer = self.get_serializer(result_list, many=True)
        return Response(serializer.data)
