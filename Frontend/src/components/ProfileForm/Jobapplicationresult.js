import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/dash.css";
import Sidebar from "../Misc/Sidebar";
import DashNavbar from "../Misc/DashNavbar";
import { Table, Alert, Modal, Button } from "react-bootstrap";
import Chart from "chart.js/auto";
import ApplicantDetailsModal from "./ApplicantDetailsModal"; 


const ApplicantModal = ({
  applicant,
  jobapplications,
  setSuccessMessage,
  updateJobApplication,
  setChartData: setModalChartData,
}) => {
  const jobStatusOptions = [
    { value: "applied", label: "Applied", bgColor: "bg-info" },
    { value: "under_review", label: "Under Review", bgColor: "bg-secondary" },
    { value: "interview_scheduled", label: "Interview Scheduled", bgColor: "bg-warning"},
    { value: "selected", label: "Selected", bgColor: "bg-success" },
    { value: "rejected", label: "Rejected", bgColor: "bg-danger" },
  ];
  const [applicationList, setApplicationList] = useState([]);
  const [show, setShow] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(null);

  const [score, setScore] = useState([]);
  const handleStatusChange = (id, newStatus) => {
    axios
      .put(`http://127.0.0.1:8000/applicants/update_status/${id}/`, {
        job_status: newStatus,
      })
      .then((response) => {
        console.log("status changed to:", newStatus);
        setSuccessMessage("Job status updated successfully");
        updateJobApplication(id, newStatus);

        axios
          .get("http://127.0.0.1:8000/applicants/")
          .then(async (response) => {
            const updatedApplications = [];

            // Map through each application
            await Promise.all(
              response.data.map(async (application) => {
                try {
                  // Fetch job titles for the applicant
                  const jobTitleResponse = await axios.get(
                    `http://127.0.0.1:8000/applicant/job-title/${application.id}`
                  );
                  // const jobTitles = jobTitleResponse.data.map(job => job.job_title);
                  const jobScore = jobTitleResponse.data.map(
                    (job) => job.similarly_score
                  );

                  setScore(jobScore);
                  console.log(score);

                  const updatedApplication = {
                    ...application,
                    // similarity_scores: extractTextResponse.data.similarity_scores,
                    // job_titles: jobTitles
                  };

                  // Push the updated application to the array
                  updatedApplications.push(updatedApplication);
                } catch (error) {
                  console.error("Error processing application:", error);
                }
              })
            );

            // After processing all applications, update the state
            setApplicationList(updatedApplications);
          });

        setTimeout(() => {
          setSuccessMessage("");
        }, 5000);
      })
      .catch((error) => {
        console.error("Error updating job status:", error);
      });
  };

  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    // Reset chartData when the modal is hidden
    if (!show) {
      setChartData(null);
    }
  }, [show]);

  useEffect(() => {
    if (show && chartData === null) {
      // Fetch personality assessment data and render the chart
      fetchPersonalityData(applicant.id);
    }
  }, [show, chartData, applicant, setChartData]);

  const fetchPersonalityData = async (applicantId) => {
    try {
      const url = applicantId
        ? `http://127.0.0.1:8000/get_personality_results/${applicantId}/`
        : "http://127.0.0.1:8000/get_personality_results/";

      const response = await axios.get(url);
      setChartData(response.data);

      // Call the function to render the chart
      createBarChart(response.data);
    } catch (error) {
      console.error("Error fetching personality assessment data:", error);
    }
  };

  // useEffect(() => {
  //   // Open the modal automatically after 5 seconds
  //   const timeout = setTimeout(() => {
  //     setShow(true);
  //   });

  //   // Set an interval to refresh the modal every 10 seconds
  //   const interval = setInterval(() => {
  //     setShow(false);
  //     setTimeout(() => {
  //       setShow(true);
  //     });
  //   });

  //   // setRefreshInterval(interval);

  //   // Clean up the timeout and interval on component unmount
  //   return () => {
  //     clearTimeout(timeout);
  //     clearInterval(interval);
  //   };
  // }, []);

  useEffect(() => {
    // Refresh the modal content when applicant, jobapplications, or similarity_scores props change
    setShow(false);
    setTimeout(() => {
      setShow(true);
    }, 100);
  }, [applicant, jobapplications, applicant.similarity_scores]);

  const onHide = () => {
    // clearInterval(refreshInterval);
    setShow(false);
  };

  return (
    <Modal show={show} onHide={onHide} dialogClassName="modal-xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>Applicant Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table bordered>
          <thead className="thead-dark">
            <tr>
              <th scope="col">Job Title</th>
              <th scope="col">Job Status</th>
              <th scope="col">Similarity Score</th>
              <th scope="col">Applied Date</th>
            </tr>
          </thead>
          <tbody>
            {jobapplications.map((jobApplication, index) => {
              console.log("jobApplication:", jobApplication);
              return (
                <tr key={index}>
                  <td className="text-center p-2">
                    {jobApplication.job_title}
                  </td>
                  <td className="text-center p-2">
                    <select
                      className={`form-select ${jobStatusOptions.find(
                        (option) => option.value === jobApplication.job_status
                      )?.bgColor
                        }`}
                      value={jobApplication.job_status}
                      onChange={(e) =>
                        handleStatusChange(jobApplication.id, e.target.value)
                      }
                    >
                      {jobStatusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="text-center p-2">
                    {applicant.similarity_scores[index]}
                  </td>
                  <td className="text-center p-2">
                    {new Date(jobApplication.applied_date).toLocaleDateString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        {/* Add the canvas element for the personality chart */}
        <div className="row justify-content-center text-center">
          <h4>Personality Assessment</h4>
          <canvas id="personalityChart" width="400" height="160"></canvas>
        </div>
      </Modal.Body>
    </Modal>
  );
};

const handleDownloadResume = async (applicantId, resumeFileName) => {
  try {
    // Fetch the resume file content from the backend
    const response = await axios.get(
      `http://127.0.0.1:8000/api/resume/${applicantId}/`,
      {
        responseType: "arraybuffer",
      }
    );

    // Create a Blob from the response data
    const blob = new Blob([response.data], { type: "application/pdf" });

    // Create a link element to trigger the download
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", resumeFileName); // Set the desired file name
    document.body.appendChild(link);

    // Trigger the download
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading resume:", error);
  }
};

const getHighestTraitIndices = (traits) => {
  const highestTrait = Math.max(...traits);
  return traits.reduce((indices, trait, index) => {
    if (trait === highestTrait) {
      indices.push(index);
    }
    return indices;
  }, []);
};

const createBarChart = (data) => {
  // Extract personality trait scores from the data
  const {
    extraversion,
    agreeableness,
    openness,
    conscientiousness,
    neuroticism,
  } = data;
  const traits = [
    extraversion,
    agreeableness,
    openness,
    conscientiousness,
    neuroticism,
  ];

  // Get the canvas element to render the chart
  const ctx = document.getElementById("personalityChart").getContext("2d");

  // Get the indices of the highest trait(s)
  const highestTraitIndices = getHighestTraitIndices(traits);

  // Create an array to hold background colors for each trait
  const backgroundColors = [
    "rgba(75, 192, 192, 0.2)",
    "rgba(75, 192, 192, 0.2)",
    "rgba(75, 192, 192, 0.2)",
    "rgba(75, 192, 192, 0.2)",
    "rgba(75, 192, 192, 0.2)",
  ];

  // Change the color of the columns with the highest trait(s)
  highestTraitIndices.forEach((index) => {
    backgroundColors[index] = "rgba(0, 0, 255, 0.2)";
  });

  // Create or update the bar chart
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: [
        "Extraversion",
        "Agreeableness",
        "Openness",
        "Conscientiousness",
        "Neuroticism",
      ],
      datasets: [
        {
          label: "Personality Traits",
          data: [
            extraversion,
            agreeableness,
            openness,
            conscientiousness,
            neuroticism,
          ],
          backgroundColor: backgroundColors,
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
          barPercentage: 10.0, // Adjust this value as needed
          categoryPercentage: 0.1, // Adjust this value as needed
        },
        {
          label: "Highest Trait",
          data: [0, 0, 0, 0, 0], // Add zeros for all traits except the highest one
          backgroundColor: "rgba(0, 0, 255, 0.2)",
          borderColor: "rgba(0, 0, 255, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: 25,
        },
      },
      // barPercentage: 1.0, // Adjust this value as needed
      // categoryPercentage: 1.5, // Adjust this value as needed
    },
  });
};

export default function Jobapplicationresult() {
  const [applicationList, setApplicationList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [successMessage, setSuccessMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const recordsPerPage = 10;
  const [jobapplications, setjobapplications] = useState([]);
  const [score, setScore] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [selectedApplicantDetails, setSelectedApplicantDetails] = useState(null);


  const updateJobApplication = (applicantId, newStatus) => {
    const updatedApplications = jobapplications.map((application) => {
      if (application.id === applicantId) {
        return { ...application, job_status: newStatus };
      }
      return application;
    });
    setjobapplications(updatedApplications);
  };

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/applicants/")
      .then(async (response) => {
        const updatedApplications = [];

        // Map through each application
        await Promise.all(
          response.data.map(async (application) => {
            try {
              // Fetch resume PDF
              const response = await axios.get(
                `http://127.0.0.1:8000/api/resume/${application.id}/`,
                { responseType: "blob" }
              );
              const pdfFile = new File([response.data], application.resume, {
                type: "application/pdf",
              });

              // Fetch job titles for the applicant
              const jobTitleResponse = await axios.get(
                `http://127.0.0.1:8000/applicant/job-title/${application.id}`
              );
              const jobTitles = jobTitleResponse.data.map(
                (job) => job.job_title
              );
              
              const similarityScores = jobTitleResponse.data.map(
                (job) => job.similarly_score
              );

              // Update application with similarity score and job titles
              const updatedApplication = {
                ...application,
                job_titles: jobTitles,
                similarity_scores: similarityScores,
              };

              // Push the updated application to the array
              updatedApplications.push(updatedApplication);
            } catch (error) {
              console.error("Error processing application:", error);
            }
          })
        );

        // After processing all applications, update the state
        setApplicationList(updatedApplications);
      })
      .catch((error) => {
        console.error("Error fetching applications:", error);
      });
  }, []);

  // Filter application list based on search query
  const filteredApplications = applicationList.filter(
    (application) =>
      application.first_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      application.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      application.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get current records
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredApplications.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  // Change page
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const [chartData, setChartData] = useState(null);

  const extractPDFText = async () => {
    const response = await axios.get("http://127.0.0.1:8000/applicants/");
    const applications = response.data;

    for (const application of applications) {
      try {
        // Fetch resume PDF
        const response = await axios.get(
          `http://127.0.0.1:8000/api/resume/${application.id}/`,
          { responseType: "blob" }
        );
        const pdfFile = new File([response.data], application.resume, {
          type: "application/pdf",
        });

        // Fetch job titles for the applicant
        const jobTitleResponse = await axios.get(
          `http://127.0.0.1:8000/applicant/job-title/${application.id}`
        );
        const jobTitles = jobTitleResponse.data.map((job) => job.job_title);
        const applicant_id = jobTitleResponse.data.map(
          (job) => job.applicant
        )[0];

        const formData = new FormData();
        formData.append("pdf_file", pdfFile);
        formData.append("job_titles", JSON.stringify(jobTitles));
        formData.append("applicant_id", applicant_id);

        const extractTextResponse = await axios.post(
          `http://127.0.0.1:8000/extract-pdf-text/` + applicant_id,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data", // Set the correct content type
            },
          }
        );
        console.log("PDF text extraction response:", extractTextResponse.data);
      } catch (error) {
        console.error("Error extracting PDF text:", error);
      }
    }
  };

  useEffect(() => {
    // Call extractPDFText function when the component mounts
    extractPDFText();
  }, []);

  const handleViewDetails = async (applicant, jobapplications) => {
    setSelectedApplicant(applicant);
    setShowModal(true);
    // await fetchDataAndStore(applicant.id);

    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/applicant/job-title/${applicant.id}/`
      );
      setjobapplications(response.data);

      // Fetch personality data for the selected applicant
      const personalityResponse = await axios.get(
        `http://127.0.0.1:8000/get_personality_results/${applicant.id}/`
      );
      setChartData(personalityResponse.data);
      // Assuming you have the applicant's PDF file and job titles available
      const pdfFile = applicant.resume; // Replace with the actual PDF file object
      const jobTitles = jobapplications.map((job) => job.job_title);
      // You can process the extracted text as needed
      // console.log(extractedText);
      // postExtractPdfText()
    } catch (error) {
      console.error("Error fetching job applications:", error);
    }
  };

  const handleViewApplicantDetails = async (applicantId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/applicants/${applicantId}/`);
      const applicantDetails = response.data;
      setSelectedApplicantDetails(applicantDetails);
      setShowDetailsModal(true);
    } catch (error) {
      console.error("Error fetching applicant details:", error);
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
          <div className="container mt-2 ">
            <div className="d-flex justify-content-center align-items-center applicationlist">
              <div className="auth-inner w-100 ">
                <div className="row justify-content-center">
                  <div className="col-lg-12">
                    <div className="bg-white rounded p-3">
                      <h2 className="display-6 gradient-text mb-4">Application List</h2>
                      {successMessage && (
                        <div
                          style={{
                            position: "fixed",
                            top: "10%",
                            right: "2%",
                            zIndex: "9999",
                          }}
                        >
                          <Alert
                            variant="success"
                            onClose={() => setSuccessMessage("")}
                            dismissible
                          >
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <span style={{ flex: 1 }}>{successMessage}</span>
                            </div>
                          </Alert>
                        </div>
                      )}
                      {/* Search bar */}
                      <div className="row justify-content-center">
                        <div className="col-md-5 mb-4">
                          <div className="input-group">
                            <div
                              className="form-outline"
                              data-mdb-input-init
                              style={{ width: "100%" }}
                            >
                              <input
                                id="search-input"
                                type="search"
                                className="form-control text-xs"
                                placeholder="Search by Name, Email or Job title"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                              />
                            </div>
                            <button
                              id="search-button"
                              type="button"
                              className="btn btn-primary text-xs"
                              style={{
                                position: "absolute",
                                right: "0px",
                                top: "0px",
                              }}
                            >
                              <i className="fas fa-search"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                      <Table responsive="xxl" size="xxl">
                        <thead className="thead-dark">
                          <tr>
                            <th scope="col">First Name</th>
                            <th scope="col">Last Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Phone</th>
                            <th scope="col">Resume</th>
                            <th scope="col">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentRecords.map((application, index) => (
                            <tr key={application.id}>
                              <td className="text-center p-2 ">
                                {application.first_name}
                              </td>
                              <td className="text-center p-2 ">
                                {application.last_name}
                              </td>
                              <td className="text-center p-2 ">
                                {application.email}
                              </td>
                              <td className="text-center p-2 ">
                                {application.phone}
                              </td>
                              <td className="text-center p-2 ">
                                {/* Display Resume and Download Option */}
                                {application.resume && (
                                  <>
                                    <span
                                      role="button"
                                      tabIndex={0}
                                      onClick={() =>
                                        handleDownloadResume(
                                          application.id,
                                          application.resume
                                        )
                                      }
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                          handleDownloadResume(
                                            application.id,
                                            application.resume
                                          );
                                        }
                                      }}
                                      className="btn btn-dark btn-sm"
                                    >
                                      <i className="fas fa-file-arrow-down me-2"></i>
                                      Download
                                    </span>
                                  </>
                                )}
                              </td>
                              <td className="text-center p-2 ">
                                <Button
                                  variant="dark"
                                  size="sm"
                                  onClick={() =>
                                    handleViewDetails(
                                      application,
                                      jobapplications
                                    )
                                  }
                                >
                                  <i className="fas fa-eye me-2"></i>
                                  View
                                </Button>

                                <Button
                                  variant="dark"
                                  size="sm"
                                  className="ms-4"
                                  onClick={() => handleViewApplicantDetails(application.id)}
                                >
                                  <i className="fas fa-circle-info me-2"></i>
                                  info
                                </Button>

                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                      {/* Pagination Controls */}
                      <nav aria-label="Page navigation">
                        <ul className="pagination justify-content-right">
                          {Array.from(
                            {
                              length: Math.ceil(
                                applicationList.length / recordsPerPage
                              ),
                            },
                            (_, index) => (
                              <li
                                key={index + 1}
                                className={`page-item ${index + 1 === currentPage ? "active" : ""
                                  }`}
                              >
                                <button
                                  className="page-link text-xs"
                                  onClick={() => handlePageChange(index + 1)}
                                >
                                  {index + 1}
                                </button>
                              </li>
                            )
                          )}
                        </ul>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {selectedApplicant && (
        <ApplicantModal
          show={showModal}
          onHide={() => setShowModal(false)}
          applicant={selectedApplicant}
          jobapplications={jobapplications}
          setjobapplications={setjobapplications}
          setSuccessMessage={setSuccessMessage}
          updateJobApplication={updateJobApplication}
        />
      )}

      {/* Applicant Details Modal */}
      {selectedApplicantDetails && (
        <ApplicantDetailsModal
          applicant={selectedApplicantDetails}
          show={showDetailsModal}
          onHide={() => setShowDetailsModal(false)}
        />
      )}
    </>
  );
}