import React, { useState, useEffect } from "react";
import axios from "axios";
import DashNavbar from "./DashNavbar";
import Sidebar from "./Sidebar";
import Pagination from "react-bootstrap/Pagination";
import Modal from "react-bootstrap/Modal";

function InterviewerFeedback() {
  const [interviewers, setInterviewers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredInterviewers, setFilteredInterviewers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchInterviewerDetails();
  }, [currentPage, searchTerm]);

  const fetchInterviewerDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/interview-evaluations/?page=${currentPage}`
      );
      setInterviewers(response.data);
      filterInterviewers(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const filterInterviewers = (data) => {
    const filtered = data.filter(
      (interviewer) =>
        interviewer.candidate
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        interviewer.candidate_email
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
    setFilteredInterviewers(filtered);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) {
      return;
    }
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(filteredInterviewers.length / itemsPerPage);
  const paginatedInterviewers = filteredInterviewers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleViewDetails = (candidate) => {
    setSelectedCandidate(candidate);
  };

  const handleCloseDetails = () => {
    setSelectedCandidate(null);
  };

  const convertRatingToText = (rating) => {
    switch (rating) {
      case 5:
        return "Exceptional";
      case 4:
        return "Above Average";
      case 3:
        return "Average";
      case 2:
        return "Satisfactory";
      case 1:
        return "Unsatisfactory";
      default:
        return "Not Rated";
    }
  };

  return (
    <>
      <div
        style={{ display: "flex", flexDirection: "column", height: "100vh" }}
      >
        <DashNavbar />
        <div style={{ display: "flex", flex: 1 }}>
          <Sidebar />
          <div className="col-lg-10 col-md-8 col-sm-12 dash4">
            <div className="container mt-4">
              <div className="auth-inner mt-5 w-100">
                <h2 className="mb-4 gradient-text">
                  Interview Feedback Evaluation
                </h2>
                <div className="input-group justify-content-center align-items-center">
                  <div className="form-outline w-50">
                    <input
                      type="search"
                      className="form-control"
                      placeholder="Search by Name or Email"
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                    <button className="btn btn-primary searchicon text-xs">
                      <i className="fas fa-search"></i>
                    </button>
                  </div>
                </div>
                <div className="table-responsive">
                  <table className="table">
                    <thead className="thead-dark">
                      <tr>
                        <th scope="col">Sr.No</th>
                        <th scope="col">Candidate</th>
                        <th scope="col">Email</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedInterviewers.map((interviewer, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{interviewer.candidate}</td>
                          <td>{interviewer.candidate_email}</td>
                          <td>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleViewDetails(interviewer)}
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="d-flex justify-content-start mt-4">
                  <Pagination>
                    <Pagination.Prev
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    />
                    {Array.from({ length: totalPages }, (_, index) => (
                      <Pagination.Item
                        key={index + 1}
                        active={index + 1 === currentPage}
                        onClick={() => handlePageChange(index + 1)}
                      >
                        {index + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    />
                  </Pagination>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal show={selectedCandidate} onHide={handleCloseDetails} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedCandidate?.candidate} ({selectedCandidate?.candidate_email}
            )
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-6">
              <div>
                <p>
                  <b>1. Educational Background</b>:{" "}
                  {convertRatingToText(
                    selectedCandidate?.educational_background
                  )}
                </p>
                <p>
                  Comment: {selectedCandidate?.educational_background_comments}
                </p>
                <hr />
              </div>
              <div>
                <p>
                  <b>2. Prior Work Experience</b>:{" "}
                  {convertRatingToText(
                    selectedCandidate?.prior_work_experience
                  )}
                </p>
                <p>
                  Comment: {selectedCandidate?.prior_work_experience_comments}
                </p>
                <hr />
              </div>
              <div>
                <p>
                  <b>3. Technical Qualifications</b>:{" "}
                  {convertRatingToText(
                    selectedCandidate?.technical_qualifications
                  )}
                </p>
                <p>
                  Comment:{" "}
                  {selectedCandidate?.technical_qualifications_comments}
                </p>
                <hr />
              </div>
              <div>
                <p>
                  <b>4. Verbal Communication</b>:{" "}
                  {convertRatingToText(selectedCandidate?.verbal_communication)}
                </p>
                <p>
                  Comment: {selectedCandidate?.verbal_communication_comments}
                </p>
                <hr />
              </div>
              <div>
                <p>
                  <b>5. Candidate Interest</b>:{" "}
                  {convertRatingToText(selectedCandidate?.candidate_interest)}
                </p>
                <p>Comment: {selectedCandidate?.candidate_interest_comments}</p>
                <hr />
              </div>
            </div>
            <div className="col-6">
              <div>
                <p>
                  <b>6. Knowledge of Organization</b>:{" "}
                  {convertRatingToText(
                    selectedCandidate?.knowledge_of_organization
                  )}
                </p>
                <p>
                  Comment:{" "}
                  {selectedCandidate?.knowledge_of_organization_comments}
                </p>
                <hr />
              </div>
              <div>
                <p>
                  <b>7. Teambuilding & Interpersonal Skills</b>:{" "}
                  {convertRatingToText(
                    selectedCandidate?.teambuilding_interpersonal_skills
                  )}
                </p>
                <p>
                  Comment:{" "}
                  {
                    selectedCandidate?.teambuilding_interpersonal_skills_comments
                  }
                </p>
                <hr />
              </div>
              <div>
                <p>
                  <b>8. Initiative</b>:{" "}
                  {convertRatingToText(selectedCandidate?.initiative)}
                </p>
                <p>Comment: {selectedCandidate?.initiative_comments}</p>
                <hr />
              </div>
              <div>
                <p>
                  <b>9. Time Management</b>:{" "}
                  {convertRatingToText(selectedCandidate?.time_management)}
                </p>
                <p>Comment: {selectedCandidate?.time_management_comments}</p>
                <hr />
              </div>
              <div>
                <p>
                  <b>10. Overall Impression</b>:{" "}
                  {convertRatingToText(selectedCandidate?.overall_impression)}
                </p>
                <p>Comment: {selectedCandidate?.overall_impression_comments}</p>
                <hr />
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default InterviewerFeedback;
