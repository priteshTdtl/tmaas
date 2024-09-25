from rest_framework.response import Response
from rest_framework.views import APIView
from nltk.tokenize import word_tokenize
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import nltk
nltk.download('punkt')
nltk.download('stopwords')

class TextSimilarity(APIView):
    def post(self, request, *args, **kwargs):
        extracted_text = request.data.get('extracted_text')
        job_description = request.data.get('job_description')
        similarity_scores = []

        if extracted_text and job_description:
            # Compute similarity score for each extracted text
            for text in extracted_text:
                similarity_score = self.text_similarity(text, job_description)
                # Round off similarity score to two decimal places
                similarity_score = round(similarity_score, 2)
                similarity_scores.append(similarity_score)

            return Response({'similarity_scores': similarity_scores})
        else:
            return Response({'error': 'Extracted text or job description is missing'})

    @staticmethod
    def text_similarity(extracted_text, job_description):
        tokens1 = word_tokenize(extracted_text)
        tokens2 = word_tokenize(job_description)
        all_tokens = set(tokens1 + tokens2)
        vector1 = [tokens1.count(token) for token in all_tokens]
        vector2 = [tokens2.count(token) for token in all_tokens]
        np_vector1 = np.array(vector1)
        np_vector2 = np.array(vector2)
        sim_score = cosine_similarity([np_vector1], [np_vector2])[0][0]
        mapped_score = 1 + (sim_score * 9)
        return mapped_score
