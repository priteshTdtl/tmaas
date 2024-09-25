import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DashNavbar from "./DashNavbar";
import "../css/dash.css";
import Sidebar from "./Sidebar";
import Swal from "sweetalert2";
import Pagination from "react-bootstrap/Pagination";

const formatDate = (dateString) => {
  if (!dateString) {
    return "Invalid Date";
  }

  try {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }

    return date.toLocaleDateString(undefined, options);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
};
const PAGE_SIZE = 8;
export default function Jobpostingresult() {
  const [Jobpostingresult, setJobpostingresult] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const openModal = (jobDetails) => {
    setSelectedJob(jobDetails);
    const modal = new window.bootstrap.Modal(
      document.getElementById("staticBackdrop")
    );
    modal.show();
  };

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/JobPostingresult_api/")
      .then((response) => {
        setJobpostingresult(response.data);
      })
      .catch((error) => {
        console.error("Error fetching jobposting data:", error);
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredJobPostings = Jobpostingresult.filter((jobPosting) =>
    jobPosting.jobtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const paginatedJobPostings = filteredJobPostings.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleApply = () => {
    if (!selectedJob || !selectedJob.id) {
      console.error("Invalid job details provided.");

      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "No job selected. Please select a job to apply.",
      });
      return;
    }

    const id = localStorage.getItem("user_id");
    const email = localStorage.getItem("email");
    if (!id || !email) {
      console.error("User id or email not found in localStorage.");
      return;
    }

    axios
      .post("http://127.0.0.1:8000/jobtitle/", {
        id,
        email,
        jobtitle: selectedJob.jobtitle,
      })
      .then((response) => {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Thank you for applying for the job.",
          timer: 1000,
          timerProgressBar: true,
          showConfirmButton: false,
        }).then(() => {
          const modal = document.getElementById("staticBackdrop");
          const modalInstance = window.bootstrap.Modal.getInstance(modal);
          if (modalInstance) {
            modalInstance.hide();
          }
          navigate("/dashboard");
        });
        console.log("Response:", response.data);
      })
      .catch((error) => {
        console.error("Error applying for job:", error);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "An error occurred while applying. Please try again.",
        });
      });
  };

  return (
    <>
      <div
        style={{ display: "flex", flexDirection: "column", height: "100vh" }}
      >
        <DashNavbar />
        <div style={{ display: "flex", flex: 1 }}>
          <Sidebar />
          <div className="container jobresult">
            <h2 className="mb-4 display-6 gradient-text ms-5">Job Openings</h2>
            <div className="row justify-content-center mb-4 ms-5">
              <div className="col-md-4 col-sm-8">
                <div className="input-group">
                  <div className="form-outline w-100  ">
                    <input
                      type="search"
                      className="form-control "
                      placeholder="Search Job Title"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />

                    <button
                      className="btn btn-primary searchicon text-xs "
                      // style={{
                      //   position: "absolute",
                      //   right: "0px",
                      //   top: "0px",
                      // }}
                    >
                      <i className="fas fa-search"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="row ms-lg-5 ps-lg-5  ps-sm-4  ps-5 divresultpos">
              {paginatedJobPostings.map((Jobposting, index) => (
                <div
                  key={Jobposting.id}
                  className="col-md-12 col-lg-5 col-xl-3 col-sm-6 mb-4"
                >
                  <div
                    className="card"
                    style={{
                      maxWidth: "18em",
                      maxHeight: "15em",
                      transition: "transform 0.3s",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.transform = "scale(1.1)")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.transform = "scale(1.0)")
                    }
                  >
                    <div className="card-body h-75">
                      <h5 className="card-title mb-2 text-muted medium">
                        {Jobposting.jobtitle}
                      </h5>
                      <p className="card-text text-start mb-0 small">
                        <strong>Job Id: </strong>
                        {Jobposting.job_id}
                      </p>
                      <p className="card-text text-start mb-2 small">
                        <strong>Posted On: </strong>
                        {formatDate(Jobposting.created_at)}
                      </p>
                      <p className="card-text text-start mb-0 small">
                        <strong>
                          <i className="fa-solid fa-briefcase" />
                        </strong>{" "}
                        {Jobposting.experience} years
                      </p>
                      <p className="card-text text-start mb-0 small">
                        <strong>
                          <i className="fa-solid fa-clock" />
                        </strong>{" "}
                        {Jobposting.role_type}
                      </p>
                      <p className="card-text text-start mb-0 small">
                        <strong>
                          <i className="fa-solid fa-location-dot" />
                        </strong>{" "}
                        {Jobposting.job_location}
                      </p>
                    </div>
                    <div className="card-footer d-flex justify-content-center">
                      <button
                        type="button"
                        className="btn btn-info mt-0"
                        onClick={() => openModal(Jobposting)}
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="d-flex justify-content-start mt-4">
                <Pagination>
                  <Pagination.Prev
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  />
                  {Array.from(
                    {
                      length: Math.ceil(filteredJobPostings.length / PAGE_SIZE),
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
                      Math.ceil(filteredJobPostings.length / PAGE_SIZE)
                    }
                  />
                </Pagination>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade "
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-scrollable modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="staticBackdropLabel">
                {selectedJob
                  ? `${selectedJob.jobtitle}  (${selectedJob.job_id})`
                  : ""}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => setSelectedJob(null)} // Reset selectedJob on modal close
              ></button>
            </div>
            <div className="modal-body" style={{ minHeight: "70vh" }}>
              {selectedJob && (
                <>
                  <div className="d-flex mb-2">
                    <strong className="me-2">Role Type:</strong>
                    <span style={{ fontWeight: "normal" }}>
                      {selectedJob.role_type}
                    </span>
                  </div>
                  <div className="d-flex mb-2">
                    <strong className="me-2">Experience:</strong>
                    <span style={{ fontWeight: "normal" }}>
                      {selectedJob.experience} years
                    </span>
                  </div>
                  <div className="d-flex mb-2">
                    <strong className="me-2">Job Location:</strong>
                    <span style={{ fontWeight: "normal" }}>
                      {selectedJob.job_location}
                    </span>
                  </div>
                  <div className="d-flex mb-2">
                    <strong className="me-2">Vacancies:</strong>
                    <span style={{ fontWeight: "normal" }}>
                      {selectedJob.vacancies}
                    </span>
                  </div>

                  <div className=" mb-2 text-start">
                    <strong className="me-2">Description:</strong>
                    <span style={{ fontWeight: "normal" }}>
                      {selectedJob.description}
                    </span>
                  </div>
                </>
              )}
            </div>

            <div className="modal-footer ">
              <button
                type="button"
                className="btn btn-success"
                onClick={() => handleApply(selectedJob)}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
