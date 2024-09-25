import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Sidebar from "../Misc/Sidebar";
import DashNavbar from "../Misc/DashNavbar";
import Modal from "react-bootstrap/Modal";
import { FaPlus, FaTrashAlt } from "react-icons/fa";
import { FadeLoader } from "react-spinners";
import { Pagination } from "react-bootstrap";
import Select from "react-select";

export default function InterviewSchedule() {
  const [studentData, setStudentData] = useState([]);
  const [interviewData, setInterviewData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showStudentListModal, setShowStudentListModal] = useState(false);
  const [interoptions, setInteroptions] = useState([]);
  const [formData, setFormData] = useState({
    candidate: "",
    interviewer: "",
    additionalMembers: [],
    meetLink: "",
    date: "",
    time: "",
  });
  const [loading, setLoading] = useState(false);
  const [interviewersData, setInterviewersData] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredInterviewData, setFilteredInterviewData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const candidates = studentData
    // Sort candidates and alphabetically
    .filter((student) => student.role === "Candidate")
    .sort((a, b) => a.name.localeCompare(b.name));

  const candioptions = candidates.map((candidate) => ({
    value: candidate.name,
    label: candidate.name,
  }));

  useEffect(() => {
    axios
      .get("http://localhost:8000/students/")
      .then((res) => setStudentData(res.data))
      .catch((err) => console.log(err));

    axios
      .get("http://localhost:8000/interviews/")
      .then((res) => {
        setInterviewData(res.data);
        setFilteredInterviewData(res.data);
      })
      .catch((err) => console.log(err));

    axios
      .get("http://localhost:8000/get_interviewers/")
      .then((res) => {
        setInterviewersData(res.data);
        const options = res.data.map((interviewer) => ({
          value: interviewer.name,
          label: interviewer.name,
        }));
        setInteroptions(options);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (!showModal) {
      setLoading(false);
    }
  }, [showModal]);

  const handleInputChange = (name, selectedOption) => {
    setFormData({
      ...formData,
      [name]: selectedOption ? selectedOption.value : "",
    });
  };

  const datehandleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddMember = () => {
    setFormData({
      ...formData,
      additionalMembers: [...formData.additionalMembers, ""],
    });
  };

  const handleRemoveMember = (index) => {
    const updatedMembers = formData.additionalMembers.filter(
      (_, i) => i !== index
    );
    setFormData({
      ...formData,
      additionalMembers: updatedMembers,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation: Check if candidate and interviewer are selected
      if (!formData.candidate || !formData.interviewer) {
        throw new Error("Please select both candidate and interviewer");
      }

      // Find selected interviewer and candidate
      const selectedInterviewer = interviewersData.find(
        (interviewer) => interviewer.name === formData.interviewer
      );

      const selectedCandidate = candidates.find(
        (candidate) => candidate.name === formData.candidate
      );

      // Check if selected interviewer and candidate exist
      if (!selectedInterviewer) {
        throw new Error("Selected interviewer not found");
      }

      if (!selectedCandidate) {
        throw new Error("Selected candidate not found");
      }

      // Prepare data to send in the request
      const dataToSend = {
        ...formData,
        additionalMembers: formData.additionalMembers,
        interviewerEmail: selectedInterviewer.email,
        candidateEmail: selectedCandidate.email,
      };

      const response = await axios.post(
        "http://localhost:8000/schedule-interview/",
        dataToSend
      );

      setInterviewData((prevInterviews) => [...prevInterviews, response.data]);
      setFormData({
        candidate: "",
        interviewer: "",
        additionalMembers: [],
        meetLink: "",
        date: "",
        time: "",
      });
      setShowModal(false);
      Swal.fire({
        icon: "success",
        title: "Interview Scheduled!",
        text: "The interview has been scheduled successfully.",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message || "Something went wrong! Please try again later.",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  };

  function formatTime(time) {
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${padZero(minutes)} ${period}`;
  }
  function padZero(number) {
    return number.toString().padStart(2, "0");
  }
  const toggleStudentListModal = () => {
    setShowStudentListModal(!showStudentListModal);
  };

  useEffect(() => {
    const filteredData = interviewData.filter((interview) => {
      const candidateMatches = interview.candidate
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const interviewerMatches = interview.interviewer
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const dateMatches = interview.date
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return candidateMatches || interviewerMatches || dateMatches;
    });
    setFilteredInterviewData(filteredData);
  }, [interviewData, searchQuery]);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInterviewData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  return (
    <>
      <div
        style={{ display: "flex", flexDirection: "column", height: "100vh" }}
      >
        <DashNavbar />
        <div style={{ display: "flex", flex: 1 }}>
          <Sidebar />
          <div className="container mt-2">
            <div className="d-flex justify-content-center align-items-center ">
              <div className="auth-inner w-100 interview_list">
                <div className="container">
                  <div className="row justify-content-center">
                    <div className="col-lg-12">
                      <div className="bg-white rounded ">
                        <h2 className="display-6 gradient-text mb-4">
                          Interview list
                        </h2>
                        <div className="input-group w-50 mx-auto mb-2">
                          <div className="form-outline w-100">
                            <input
                              type="search"
                              className="form-control"
                              placeholder="Search by candidate, interviewer, or date"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                            />

                            <button className="btn btn-primary text-xs searchicon">
                              <i className="fas fa-search"></i>
                            </button>
                          </div>
                        </div>
                        <div className="d-flex justify-content-between mb-3">
                          <button
                            className="btn btn-success"
                            onClick={() => setShowModal(true)}
                          >
                            <FaPlus /> Schedule Interview
                          </button>

                          <button
                            className="btn btn-primary"
                            onClick={toggleStudentListModal}
                          >
                            View Users
                          </button>
                        </div>

                        <div className="table-responsive">
                          <table className="table hover">
                            <thead>
                              <tr>
                                <th>ID</th>
                                <th>Candidate</th>
                                <th>Interviewer</th>
                                <th>Date</th>
                                <th>Time</th>
                              </tr>
                            </thead>
                            <tbody>
                              {currentItems.map((interview, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>{interview.candidate}</td>
                                  <td>{interview.interviewer}</td>
                                  <td>{interview.date}</td>
                                  <td>{formatTime(interview.time)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <Pagination>
                          <Pagination.Prev
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                          />
                          {Array.from(
                            {
                              length: Math.ceil(
                                filteredInterviewData.length / itemsPerPage
                              ),
                            },
                            (_, index) => (
                              <Pagination.Item
                                key={index + 1}
                                active={index + 1 === currentPage}
                                onClick={() => handlePageChange(index + 1)}
                              >
                                {index + 1}
                              </Pagination.Item>
                            )
                          )}
                          <Pagination.Next
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={
                              currentPage ===
                              Math.ceil(
                                filteredInterviewData.length / itemsPerPage
                              )
                            }
                          />
                        </Pagination>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        className={showModal ? "fade-in" : "fade-out"}
      >
        <Modal.Header closeButton>
          <Modal.Title>Schedule Interview</Modal.Title>
          <FadeLoader color="#085ab2" loading={loading} />
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <div className="mb-3">
                <label>Candidate:</label>
                <Select
                  options={candioptions}
                  value={candioptions.find(
                    (option) => option.value === formData.candidate
                  )}
                  onChange={(selectedOption) =>
                    handleInputChange("candidate", selectedOption)
                  }
                  placeholder="Select Candidate"
                  isSearchable={true}
                />
              </div>

              <div className="mb-3">
                <label>Interviewer:</label>
                <Select
                  options={interoptions}
                  value={
                    interoptions.find(
                      (option) => option.value === formData.interviewer
                    )
                      ? {
                          value: formData.interviewer,
                          label: formData.interviewer,
                        }
                      : null
                  }
                  onChange={(selectedOption) =>
                    handleInputChange("interviewer", selectedOption)
                  }
                  placeholder="Select Interviewer"
                  isSearchable={true}
                />
              </div>

              {formData.additionalMembers.map((member, index) => (
                <div key={index} className="mb-3">
                  <label>Additional Member:</label>
                  <div className="d-flex align-items-center">
                    <Select
                      options={studentData.map((student) => ({
                        value: student.name,
                        label: student.name,
                      }))}
                      value={
                        studentData.find((student) => student.name === member)
                          ? { value: member, label: member }
                          : null
                      }
                      onChange={(selectedOption) => {
                        const updatedMembers = [...formData.additionalMembers];
                        updatedMembers[index] = selectedOption.value;
                        setFormData({
                          ...formData,
                          additionalMembers: updatedMembers,
                        });
                      }}
                      placeholder="Select Member"
                      isSearchable={true}
                      styles={{
                        container: (provided) => ({
                          ...provided,
                          width: "100%",
                        }),
                      }}
                    />
                    <button
                      type="button"
                      className="btn btn-danger ms-2"
                      onClick={() => handleRemoveMember(index)}
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
              ))}

              <div className="mb-3">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAddMember}
                >
                  <FaPlus /> Add Member
                </button>
              </div>

              <div className="mb-3">
                <label>Date:</label>
                <input
                  type="date"
                  className="form-control"
                  name="date"
                  value={formData.date}
                  onChange={datehandleInputChange}
                />
              </div>

              <div className="mb-3">
                <label>Time:</label>
                <input
                  type="time"
                  className="form-control"
                  name="time"
                  value={formData.time}
                  onChange={datehandleInputChange}
                />
              </div>

              <div className="mb-3">
                <label>Meeting Link:</label>
                <input
                  type="text"
                  className="form-control"
                  name="meetLink"
                  value={formData.meetLink}
                  onChange={datehandleInputChange}
                  placeholder="Enter meeting link"
                />
              </div>
            </div>
            <div className="d-flex justify-content-center mb-3">
              <button type="submit" className="btn btn-success">
                Schedule Interview
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      <Modal
        show={showStudentListModal}
        onHide={toggleStudentListModal}
        centered
        className={showStudentListModal ? "fade-in" : "fade-out"}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Student List</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="table-responsive">
            <table className="table hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {studentData.map((student, index) => (
                  <tr key={index}>
                    <td>{student.id}</td>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>{student.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
