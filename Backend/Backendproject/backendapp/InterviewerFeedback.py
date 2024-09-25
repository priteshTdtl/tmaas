from rest_framework.views import APIView
from rest_framework.response import Response
from .models import InterviewEvaluation
from .serializers import InterviewEvaluationSerializer
from django.core.paginator import Paginator

class InterviewEvaluationListView(APIView):
    def get(self, request):
        interviews = InterviewEvaluation.objects.all()
        paginator = Paginator(interviews, 5)  # Change '5' to your desired items per page
        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)
        serializer = InterviewEvaluationSerializer(page_obj, many=True)
        return Response(serializer.data)
