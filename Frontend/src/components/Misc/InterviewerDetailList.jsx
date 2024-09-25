import React, { useState, useEffect } from "react";
import DashNavbar from "./DashNavbar";
import Sidebar from "./Sidebar";
import Pagination from "react-bootstrap/Pagination";

function InterviewerDetailList() {
  const [interviewers, setInterviewers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredInterviewers, setFilteredInterviewers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchInterviewerDetails();
  }, [currentPage, searchTerm]);

  const fetchInterviewerDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/interviewer-details/?page=${currentPage}&limit=${itemsPerPage}`
      );
      const data = await response.json();
      setInterviewers(data);
      filterInterviewers(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const filterInterviewers = (data) => {
    const filtered = data.filter(
      (interviewer) =>
        interviewer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        interviewer.skills.toLowerCase().includes(searchTerm.toLowerCase()) ||
        interviewer.experience.toLowerCase().includes(searchTerm.toLowerCase())
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
                <h2 className="mb-4 gradient-text">Interviewer Details</h2>
                <div className="input-group justify-content-center align-items-center">
                  <div className="form-outline w-50">
                    <input
                      type="search"
                      className="form-control"
                      placeholder="Search by Name, Skill, or Experience"
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
                        <th scope="col">Employee ID</th>
                        <th scope="col">Interviewer</th>
                        <th scope="col">Skills</th>
                        <th scope="col">Experience</th>
                        <th scope="col">Email</th>
                        <th scope="col">Phone</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedInterviewers.map((interviewer, index) => (
                        <tr key={index}>
                          <td>{interviewer.employee_id}</td>
                          <td>{interviewer.name}</td>
                          <td>{interviewer.skills}</td>
                          <td>{interviewer.experience}</td>
                          <td>{interviewer.email}</td>
                          <td>{interviewer.phone}</td>
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
    </>
  );
}

export default InterviewerDetailList;
