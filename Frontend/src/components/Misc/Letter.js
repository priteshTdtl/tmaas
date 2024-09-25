import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DashNavbar from "./DashNavbar";
import Sidebar from "./Sidebar";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import { Table, Pagination } from "react-bootstrap";
import Swal from "sweetalert2";
import { FcApproval, FcHighPriority } from "react-icons/fc";
import Select from "react-select";

const OfferLetterGenerator = () => {
  const [letters, setLetters] = useState([]);
  const [candidateNames, setCandidateNames] = useState([]);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLetters, setFilteredLetters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [sentStatus, setSentStatus] = useState({});

  useEffect(() => {
    async function fetchLetters() {
      try {
        const response = await axios.get("http://127.0.0.1:8000/get_letters/");
        const data = response.data;
        if (data && Array.isArray(data.letters)) {
          setLetters(data.letters);
          initializeSentStatus(data.letters);
        } else {
          console.error("Invalid data format: letters field is not an array");
          setLetters([]);
        }
      } catch (error) {
        console.error("Error fetching letters:", error);
        setLetters([]);
      }
    }
    async function fetchCandidateNames() {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/get_candidate_names/"
        );
        const data = response.data;
        if (data && Array.isArray(data.candidate_names)) {
          setCandidateNames(data.candidate_names);
        } else {
          console.error(
            "Invalid data format: candidate_names field is not an array"
          );
          setCandidateNames([]);
        }
      } catch (error) {
        console.error("Error fetching candidate names:", error);
        setCandidateNames([]);
      }
    }
    fetchLetters();
    fetchCandidateNames();
  }, []);

  const initializeSentStatus = (lettersData) => {
    const initialSentStatus = {};
    lettersData.forEach((letter) => {
      initialSentStatus[letter.pk] = letter.fields.sent == 1;
      console.log(letter.fields.sent);
    });
    setSentStatus(initialSentStatus);
    console.log(initialSentStatus);
  };
  const sendEmail = async (candidateName, pdfPath, LetterType, index) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/send_offer_letter_email/",
        {
          candidate_name: candidateName,
          pdf_path: pdfPath,
          letter_type: LetterType,
        }
      );
      Swal.fire({
        icon: "success",
        title: "Email Sent!",
        text: "The email has been successfully sent.",
        timer: 1000,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      // Disable the button and update its text to 'Sent'
      const updatedSentStatus = { ...sentStatus };
      updatedSentStatus[letters[index].pk] = true;
      setSentStatus(updatedSentStatus);
      await axios.put(
        `http://127.0.0.1:8000/update_sent_status/${letters[index].pk}/`,
        { sent: 1 }
      );
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Email Not Sent!",
        text: "The email has been not  sent.",
        timer: 4000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  };

  const downloadPdf = async (pdfPath) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/download_pdf/?pdfPath=${pdfPath}`,
        {
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "letter.pdf");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  const [formData, setFormData] = useState({
    candidateName: "",
    position: "",
    salary: "",
    date: "",
    section: "Offer Letter",
  });
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const formattedValue =
      name === "date" ? new Date(value).toISOString().split("T")[0] : value;
    setFormData((prevState) => ({
      ...prevState,
      [name]: formattedValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/offer_letter/", formData);

      if (formData.section === "Offer Letter") {
        navigate("/OfferLetter", { state: formData });
      } else if (formData.section === "Rejection Letter") {
        navigate("/letterform", { state: formData });
        handleCloseModal();
      }
    } catch (error) {
      console.error("Error generating offer letter:", error);
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  const formatDateTime = (dateTimeString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };
    return new Date(dateTimeString).toLocaleString(undefined, options);
  };
  useEffect(() => {
    const filteredData = letters.filter((letter) => {
      const candidateMatches = letter.fields.candidate_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const typeMatches = letter.fields.LetterType.toLowerCase().includes(
        searchQuery.toLowerCase()
      );
      return candidateMatches || typeMatches;
    });
    setFilteredLetters(filteredData);
  }, [letters, searchQuery]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLetters.slice(indexOfFirstItem, indexOfLastItem);

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
          <div className="container mt-2 ">
            <div className="d-flex justify-content-center align-items-center letterpage">
              <div className="auth-inner w-100">
                <div className="bg-white rounded ">
                  <h2 className="display-6 gradient-text mb-4">Letters</h2>
                  <div className="d-flex justify-content-center ">
                    <div className="input-group search1 ">
                      <div className="form-outline w-100 ">
                        <input
                          type="search"
                          className="form-control"
                          placeholder="Search by Candidate and Letter type"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button
                          className="btn btn-primary searchicon"
                          type="button"
                        >
                          <i className="fas fa-search"></i>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-start">
                    {" "}
                    <Button
                      onClick={handleOpenModal}
                      className="btn btn-primary mb-3"
                    >
                      Create Letter +
                    </Button>
                  </div>
                  <Table hover responsive="lg" size="lg">
                    <thead className="thead-dark">
                      <tr>
                        <th>Sr.No</th>
                        <th>Candidate Name</th>
                        <th>Letter Type</th>
                        <th>Letter PDF</th>
                        <th>Time</th>
                        <th>Send Mail</th>
                        <th>Mail Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((letter, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{letter.fields.candidate_name}</td>
                          <td>{letter.fields.LetterType}</td>
                          <td>
                            <Button
                              onClick={() =>
                                downloadPdf(letter.fields.pdf_path)
                              }
                              disabled={
                                letter.fields.LetterType === "Rejection Letter"
                              }
                            >
                              Download
                            </Button>
                          </td>
                          <td>{formatDateTime(letter.fields.Time)}</td>
                          <td>
                            <Button
                              onClick={() =>
                                sendEmail(
                                  letter.fields.candidate_name,
                                  letter.fields.pdf_path,
                                  letter.fields.LetterType,
                                  index
                                )
                              }
                              disabled={sentStatus[letter.pk]}
                            >
                              {sentStatus[letter.pk] ? "Sent" : "Send"}
                            </Button>
                          </td>
                          <td>
                            {sentStatus[letter.pk] ? (
                              <div style={{ fontSize: "28px" }}>
                                <FcApproval />{" "}
                              </div>
                            ) : (
                              <div style={{ fontSize: "28px" }}>
                                <FcHighPriority />
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
                <Pagination>
                  <Pagination.Prev
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  />
                  {Array.from(
                    {
                      length: Math.ceil(filteredLetters.length / itemsPerPage),
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
                      Math.ceil(filteredLetters.length / itemsPerPage)
                    }
                  />
                </Pagination>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        contentLabel="Offer Letter Form"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          },
          content: {
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "60%",
            maxWidth: "600px",
            maxHeight: "80%",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
          },
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Offer Letter Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="section" className="form-label">
                Select Section:
              </label>
              <select
                id="section"
                name="section"
                className="form-select"
                value={formData.section}
                onChange={handleChange}
              >
                <option value="Offer Letter">Offer Letter</option>
                <option value="Rejection Letter">Rejection Letter</option>
              </select>
            </div>
            {formData.section === "Offer Letter" && (
              <>
                <div className="mb-3">
                  <label htmlFor="candidateName" className="form-label">
                    Candidate Name:
                  </label>
                  <Select
                    options={candidateNames.map((candidate) => ({
                      value: candidate,
                      label: candidate,
                    }))}
                    value={
                      formData.candidateName
                        ? {
                            value: formData.candidateName,
                            label: formData.candidateName,
                          }
                        : null
                    }
                    onChange={(selectedOption) =>
                      setFormData({
                        ...formData,
                        candidateName: selectedOption?.value || "",
                      })
                    }
                    placeholder="Select candidate"
                    isSearchable={true}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="position" className="form-label">
                    Position:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="salary" className="form-label">
                    Salary:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="salary"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="date" className="form-label">
                    Date:
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}

            {formData.section === "Rejection Letter" && (
              <>
                <div className="mb-3">
                  <label htmlFor="candidateName" className="form-label">
                    Candidate Name:
                  </label>
                  <Select
                    options={candidateNames.map((candidate) => ({
                      value: candidate,
                      label: candidate,
                    }))}
                    value={
                      formData.candidateName
                        ? {
                            value: formData.candidateName,
                            label: formData.candidateName,
                          }
                        : null
                    }
                    onChange={(selectedOption) =>
                      setFormData({
                        ...formData,
                        candidateName: selectedOption?.value || "",
                      })
                    }
                    placeholder="Select candidate"
                    isSearchable={true}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="date" className="form-label">
                    Date:
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}
            <Button type="submit" className="btn btn-primary">
              Generate
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default OfferLetterGenerator;
