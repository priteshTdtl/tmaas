import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import { Form, Button } from "react-bootstrap";
import Sidebar from "./Sidebar";
import DashNavbar from "./DashNavbar";
import Select from "react-select";

export default function EvaluationForm() {
    const [formData, setFormData] = useState({
        candidate: '',
        candidateEmail: '',
        educationalBackground: '',
        educationalBackgroundComments: '',
        priorWorkExperience: '',
        priorWorkExperienceComments: '',
        technicalQualifications: '',
        technicalQualificationsComments: '',
        verbalCommunication: '',
        verbalCommunicationComments: '',
        candidateInterest: '',
        candidateInterestComments: '',
        knowledgeOfOrganization: '',
        knowledgeOfOrganizationComments: '',
        teambuildingInterpersonalSkills: '',
        teambuildingInterpersonalSkillsComments: '',
        initiative: '',
        initiativeComments: '',
        timeManagement: '',
        timeManagementComments: '',
        overallImpression: '',
        overallImpressionComments: '',
    });
    const [candidates, setCandidates] = useState([]);

    useEffect(() => {
        
        fetchCandidates();
    }, []);

    const fetchCandidates = async () => {
        try {
            const email = localStorage.getItem('email'); 
            const response = await fetch('http://127.0.0.1:8000/interviewers/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: email })
            });
            if (!response.ok) {
                throw new Error('Failed to fetch candidates');
            }
            const data = await response.json();
            
            const candidatesData = data.map(candidate => ({
                name: candidate.candidate,
                email: candidate.candidate_email      
            }));
            setCandidates(candidatesData);
        } catch (error) {
            console.error('Error fetching candidates:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataWithCandidateEmail = {
                ...formData,
                candidateEmail: candidates.find(candidate => candidate.name === formData.candidate)?.email
            };
    
            const response = await fetch('http://127.0.0.1:8000/save_evaluation/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formDataWithCandidateEmail)
            });
    
            if (!response.ok) {
                throw new Error('Failed to save evaluation');
            }
    
            Swal.fire({
                icon: 'success',  
                title: 'Great',
                text: 'Candidate evaluated successfully!',
            });
        } catch (error) {
            console.error('Error saving evaluation:', error);
            
            Swal.fire({
                icon: 'warning',
                title: 'Oops...',
                text: 'You have already evaluated this candidate!',
            });
        }
    };

    return (
        <>
            <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
                <DashNavbar />
                <div style={{ display: "flex", flex: 1 }}>
                    <Sidebar />
                    <div className="container mt-2">
                        <div className="row justify-content-center ms-lg-5 pt-lg-4 mt-lg-5 ms-md-5 mt-sm-5 ps-sm-5 pt-sm-5 ps-1 ms-4 mt-5 pt-5" style={{ width: "100%", textAlign:"start" }}>
                            <div className="col-md-8 col-9 auth-inner w-75">
                                <h2 className="display-6 gradient-text mb-4 text-center">Evaluation Form</h2>
                                <p className="text-success">Interview evaluation forms are to be completed by the interviewer to rank the candidate’s overall qualifications for the position for which they have applied. Under each heading, the interviewer should give the candidate a rating and write specific job-related comments in the space provided.</p>
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group controlId="candidate">
                                        <Select 
                                            options={candidates.map((candidate) => ({
                                                value: candidate.name,
                                                label: candidate.name,
                                            }))}
                                            value={
                                                formData.candidate
                                                ? {
                                                    value: formData.candidate,
                                                    label: formData.candidate,
                                                }
                                                : null
                                            }
                                            onChange={(selectedOption) =>
                                                setFormData({
                                                    ...formData,
                                                    candidate: selectedOption?.value || "",
                                                })
                                            }
                                            placeholder="Select Candidate"
                                            isSearchable={true}
                                            styles={{
                                                control: (styles) => ({
                                                    ...styles,
                                                    textAlign: "start",
                                                }),
                                            }}
                                        />
                                    </Form.Group>

                                    <hr />
                                    <div className="row">
                                        <div className="col-md-6">
                                            <Form.Group controlId="educationalBackground">
                                                <Form.Label className="mb-2 text-start">1. Educational Background</Form.Label>
                                                <Form.Control as="select" name="educationalBackground" value={formData.educationalBackground} onChange={handleChange} className="form-select">
                                                    <option value="">Select rating...</option>
                                                    <option value="5" dropdown-toggle dropdown-toggle-split>Exceptional</option>
                                                    <option value="4">Above Average</option>
                                                    <option value="3">Average</option>
                                                    <option value="2">Satisfactory</option>
                                                    <option value="1">Unsatisfactory</option>
                                                </Form.Control>
                                                <Form.Control as="textarea" rows={2} name="educationalBackgroundComments" value={formData.educationalBackgroundComments} onChange={handleChange} placeholder="Comments..." />
                                            </Form.Group>
                                        </div>
                                        <div className="col-md-6">
                                            <Form.Group controlId="priorWorkExperience">
                                                <Form.Label className="mb-2 text-start">2. Prior Work Experience</Form.Label>
                                                <Form.Control as="select" name="priorWorkExperience" value={formData.priorWorkExperience} onChange={handleChange} className="form-select">
                                                    <option value="">Select rating...</option>
                                                    <option value="5">Exceptional</option>
                                                    <option value="4">Above Average</option>
                                                    <option value="3">Average</option>
                                                    <option value="2">Satisfactory</option>
                                                    <option value="1">Unsatisfactory</option>
                                                </Form.Control>
                                                <Form.Control as="textarea" rows={2} name="priorWorkExperienceComments" value={formData.priorWorkExperienceComments} onChange={handleChange} placeholder="Comments..." />
                                            </Form.Group>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <Form.Group controlId="technicalQualifications" className="mt-4">
                                                <Form.Label>3. Technical Qualifications/Experience</Form.Label>
                                                <Form.Control as="select" name="technicalQualifications" value={formData.technicalQualifications} onChange={handleChange}>
                                                    <option value="">Select rating...</option>
                                                    <option value="5">Exceptional</option>
                                                    <option value="4">Above Average</option>
                                                    <option value="3">Average</option>
                                                    <option value="2">Satisfactory</option>
                                                    <option value="1">Unsatisfactory</option>
                                                </Form.Control>
                                                <Form.Control as="textarea" rows={2} name="technicalQualificationsComments" value={formData.technicalQualificationsComments} onChange={handleChange} placeholder="Comments..." />
                                            </Form.Group>
                                        </div>
                                        <div className="col-md-6">
                                            <Form.Group controlId="verbalCommunication" className="mt-4">
                                                <Form.Label>4. Verbal Communication</Form.Label>
                                                <Form.Control as="select" name="verbalCommunication" value={formData.verbalCommunication} onChange={handleChange}>
                                                    <option value="">Select rating...</option>
                                                    <option value="5">Exceptional</option>
                                                    <option value="4">Above Average</option>
                                                    <option value="3">Average</option>
                                                    <option value="2">Satisfactory</option>
                                                    <option value="1">Unsatisfactory</option>
                                                </Form.Control>
                                                <Form.Control as="textarea" rows={2} name="verbalCommunicationComments" value={formData.verbalCommunicationComments} onChange={handleChange} placeholder="Comments..." />
                                            </Form.Group>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <Form.Group controlId="candidateInterest" className="mt-4">
                                                <Form.Label>5. Candidate Interest</Form.Label>
                                                <Form.Control as="select" name="candidateInterest" value={formData.candidateInterest} onChange={handleChange}>
                                                    <option value="">Select rating...</option>
                                                    <option value="5">Exceptional</option>
                                                    <option value="4">Above Average</option>
                                                    <option value="3">Average</option>
                                                    <option value="2">Satisfactory</option>
                                                    <option value="1">Unsatisfactory</option>
                                                </Form.Control>
                                                <Form.Control as="textarea" rows={2} name="candidateInterestComments" value={formData.candidateInterestComments} onChange={handleChange} placeholder="Comments..." />
                                            </Form.Group>
                                        </div>
                                        <div className="col-md-6">
                                            <Form.Group controlId="knowledgeOfOrganization" className="mt-4">
                                                <Form.Label>6. Knowledge of Organization</Form.Label>
                                                <Form.Control as="select" name="knowledgeOfOrganization" value={formData.knowledgeOfOrganization} onChange={handleChange}>
                                                    <option value="">Select rating...</option>
                                                    <option value="5">Exceptional</option>
                                                    <option value="4">Above Average</option>
                                                    <option value="3">Average</option>
                                                    <option value="2">Satisfactory</option>
                                                    <option value="1">Unsatisfactory</option>
                                                </Form.Control>
                                                <Form.Control as="textarea" rows={2} name="knowledgeOfOrganizationComments" value={formData.knowledgeOfOrganizationComments} onChange={handleChange} placeholder="Comments..." />
                                            </Form.Group>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <Form.Group controlId="teambuildingInterpersonalSkills" className="mt-4">
                                                <Form.Label>7. Teambuilding/Interpersonal Skills</Form.Label>
                                                <Form.Control as="select" name="teambuildingInterpersonalSkills" value={formData.teambuildingInterpersonalSkills} onChange={handleChange}>
                                                    <option value="">Select rating...</option>
                                                    <option value="5">Exceptional</option>
                                                    <option value="4">Above Average</option>
                                                    <option value="3">Average</option>
                                                    <option value="2">Satisfactory</option>
                                                    <option value="1">Unsatisfactory</option>
                                                </Form.Control>
                                                <Form.Control as="textarea" rows={2} name="teambuildingInterpersonalSkillsComments" value={formData.teambuildingInterpersonalSkillsComments} onChange={handleChange} placeholder="Comments..." />
                                            </Form.Group>
                                        </div>
                                        <div className="col-md-6">
                                            <Form.Group controlId="initiative" className="mt-4">
                                                <Form.Label>8. Initiative </Form.Label>
                                                <Form.Control as="select" name="initiative" value={formData.initiative} onChange={handleChange}>
                                                    <option value="">Select rating...</option>
                                                    <option value="5">Exceptional</option>
                                                    <option value="4">Above Average</option>
                                                    <option value="3">Average</option>
                                                    <option value="2">Satisfactory</option>
                                                    <option value="1">Unsatisfactory</option>
                                                </Form.Control>
                                                <Form.Control as="textarea" rows={2} name="initiativeComments" value={formData.initiativeComments} onChange={handleChange} placeholder="Comments..." />
                                            </Form.Group>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <Form.Group controlId="timeManagement" className="mt-4">
                                                <Form.Label>9. Time Management</Form.Label>
                                                <Form.Control as="select" name="timeManagement" value={formData.timeManagement} onChange={handleChange}>
                                                    <option value="">Select rating...</option>
                                                    <option value="5">Exceptional</option>
                                                    <option value="4">Above Average</option>
                                                    <option value="3">Average</option>
                                                    <option value="2">Satisfactory</option>
                                                    <option value="1">Unsatisfactory</option>
                                                </Form.Control>
                                                <Form.Control as="textarea" rows={2} name="timeManagementComments" value={formData.timeManagementComments} onChange={handleChange} placeholder="Comments..." />
                                            </Form.Group>
                                        </div>
                                        <div className="col-md-6">
                                            <Form.Group controlId="overallImpression" className="mt-4">
                                                <Form.Label>10. Overall Impression and Recommendation</Form.Label>
                                                <Form.Control as="select" name="overallImpression" value={formData.overallImpression} onChange={handleChange}>
                                                    <option value="">Select rating...</option>
                                                    <option value="5">Exceptional</option>
                                                    <option value="4">Above Average</option>
                                                    <option value="3">Average</option>
                                                    <option value="2">Satisfactory</option>
                                                    <option value="1">Unsatisfactory</option>
                                                </Form.Control>
                                                <Form.Control as="textarea" rows={2} name="overallImpressionComments" value={formData.overallImpressionComments} onChange={handleChange} placeholder="Comments..." />
                                            </Form.Group>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                    <Button variant="primary" type="submit" className="mt-4 btn-block" style={{textAlign:"center"}}>
                                        Submit
                                    </Button>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
