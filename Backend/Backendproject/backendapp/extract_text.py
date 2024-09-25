from rest_framework.decorators import api_view
from PyPDF2 import PdfReader
from .models import JobApplication
from django.http import JsonResponse
import re
import json
import subprocess
import nltk
nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')
nltk.download('maxent_ne_chunker')
nltk.download('words')

PHONE_REG = re.compile(r'[\+\(]?[1-9][0-9 .\-\(\)]{8,}[0-9]')
university_REGEX = re.compile(r'(?<![\w.-])[^\s,.]+ (?:University)(?![a-zA-Z]+\s[a-zA-Z]+)', re.IGNORECASE)
COLLEGE_REGEX = re.compile(r'(?<![\w.-])[^\s,.]+ (?:college|institude|school)(?![a-zA-Z]+\s[a-zA-Z]+)', re.IGNORECASE)
RESERVED_WORDS = [
    'college',
    'univers',
    'academy',
    'faculty',
    'institute',
]

def extract_college(resume_text):
    match = re.search(COLLEGE_REGEX, resume_text)
    if match:
        return match.group()
    return None

def extract_university(resume_text):
    matches = re.findall(university_REGEX, resume_text)
    if matches:
        return matches[0]
    return None

def extract_phone_number(resume_text):
    phone = re.findall(PHONE_REG, resume_text)
    if phone:
        number = ''.join(phone[0])

        if resume_text.find(number) >= 0 and len(number) < 16:
            return number
    return None

def extract_names(txt):
    person_names = []
 
    for sent in nltk.sent_tokenize(txt):
        for chunk in nltk.ne_chunk(nltk.pos_tag(nltk.word_tokenize(sent))):
            if hasattr(chunk, 'label') and chunk.label() == 'PERSON':
                person_names.append(
                    ' '.join(chunk_leave[0] for chunk_leave in chunk.leaves())
                )
 
    return person_names

def get_name_via_nltk(input_text):
    '''extract name from text via nltk functions'''
    names = []
    for sent in nltk.sent_tokenize(input_text):
        for chunk in nltk.ne_chunk(nltk.pos_tag(nltk.word_tokenize(sent))):
            if hasattr(chunk, 'label'):
                name = ' '.join(c[0] for c in chunk.leaves())
                names.append(name)
    return names


def extract_education(input_text):
    organizations = [] 
    # first get all the organization names using nltk
    for sent in nltk.sent_tokenize(input_text):
        for chunk in nltk.ne_chunk(nltk.pos_tag(nltk.word_tokenize(sent))):
            if hasattr(chunk, 'label') and chunk.label() == 'ORGANIZATION':
                organizations.append(' '.join(c[0] for c in chunk.leaves()))
 
    education = set()
    for org in organizations:
        for word in RESERVED_WORDS:
            if org.lower().find(word) >= 0:
                education.add(org)
 
    return education

@api_view(['POST'])
def extract_text(request):
    
    if request.method == 'POST':
        pdf_file = request.FILES.get('pdf_file')
        applicant_id=request.data.get('applicant_id')
        
        if pdf_file:
                with pdf_file as file:
                    pdf_reader = PdfReader(file)
                    page_nums = len(pdf_reader.pages)
                    extracted_text = []
                    for page_num in range(page_nums):
                        page = pdf_reader.pages[page_num]
                        text = page.extract_text()
                        extracted_text.append(text)
        
        # print(extracted_text)
        all_text = ' '.join(extracted_text)
        
        
        college=extract_college(all_text)
        print('college:',college)
        university = extract_university(all_text)
        print('university:',university)                   
        job_applications = JobApplication.objects.filter(applicant_id=applicant_id)
        phone_number = extract_phone_number(all_text)
        print(phone_number)
        names = get_name_via_nltk(all_text)
        # emails = extract_emails(all_text)
        
        
    return JsonResponse({
                        'applicant_id': applicant_id,
                        'university_information':university,
                        'phone_number': phone_number,
                        'name':names,
                        'college_information':college,
                        # 'email':emails                       
                    })

import re
import subprocess
from django.http import JsonResponse
import requests
from django.views.decorators.csrf import csrf_exempt

PHONE_REG = re.compile(r'[\+\(]?[1-9][0-9 .\-\(\)]{8,}[0-9]')

def extract_phone_number(resume_text):
    phone = re.findall(PHONE_REG, resume_text)

    if phone:
        number = ''.join(phone[0])

        if resume_text.find(number) >= 0 and len(number) < 16:
            return number
    return None

@api_view(['GET'])
def extract_info(request):
    response = requests.get('http://127.0.0.1:8000/extract_text/')
    data = response.json()
    extracted_text = data.get('extracted_text', [])
    return JsonResponse({'extracted_text': extracted_text})
