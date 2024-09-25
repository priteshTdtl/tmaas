import React, { useState, useEffect } from "react";
import DashNavbar from "./DashNavbar";
import Sidebar from "./Sidebar";
import ApplicantDetailsModal from "../ProfileForm/ApplicantDetailsModal";
import "../css/dash.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/PDFViewer.css";
import { Link } from "react-router-dom";

function InterviewerDashboard() {
  const [interviewSchedule, setInterviewSchedule] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState({});

  useEffect(() => {
    fetchInterviewSchedule();
  }, []);

  const fetchInterviewSchedule = () => {
    const userEmail = localStorage.getItem("email");
    if (!userEmail) {
      console.error("User email not found in local storage");
      return;
    }

    fetch(`http://127.0.0.1:8000/interviewers/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: userEmail }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        const formattedData = data.map((interview) => ({
          ...interview,
          date: formatDate(interview.date),
          time: formatTime(interview.time),
        }));
        setInterviewSchedule(formattedData);

        // Fetch applied jobs for the interview schedule
        fetchAppliedJobsForSchedule(formattedData);
      })
      .catch((error) => {
        console.error("Error fetching interview schedule:", error);
      });
  };

  const fetchAppliedJobsForSchedule = (schedule) => {
    const candidateEmails = schedule.map(
      (interview) => interview.candidate_email
    );
    candidateEmails.forEach((email) => {
      fetch(`http://127.0.0.1:8000/get_applied_job/${email}/`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((appliedJobsResponse) => {
          setAppliedJobs((prevJobs) => ({
            ...prevJobs,
            [email]: appliedJobsResponse.job_titles || ["Not Applied"],
          }));
        })
        .catch((error) => {
          console.error("Error fetching applied jobs:", error);
        });
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = `${date.getDate()}-${
      date.getMonth() + 1
    }-${date.getFullYear()}`;
    return formattedDate;
  };

  const formatTime = (timeString) => {
    const time = new Date(`01/01/2022 ${timeString}`);
    const formattedTime = time.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
    return formattedTime;
  };

  const handleViewClick = (candidateEmail) => {
    fetch("http://127.0.0.1:8000/get_applicant_data/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: candidateEmail }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setSelectedApplicant(data);
        setShowModal(true);
      })
      .catch((error) => {
        console.error("Error fetching applicant data:", error);
      });
  };

  const handleViewResume = (candidateEmail) => {
    fetch("http://127.0.0.1:8000/view_resume/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: candidateEmail }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.blob();
      })
      .then((blob) => {
        const resumeBlobUrl = URL.createObjectURL(blob);
        window.open(resumeBlobUrl, "_blank");
      })
      .catch((error) => {
        console.error("Error fetching resume:", error);
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
          <div className="col-lg-10 col-md-8 col-sm-12 dash4">
            <div className="container mt-4">
              <div className="text-start">
                <h3>Welcome to your Dashboard</h3>
                <p>Below is your interview schedule:</p>
              </div>
              <div className="auth-inner mt-5 w-100">
                <h2 className="mb-4">Interview Schedule</h2>
                <div className="table-responsive">
                  <table className="table">
                    <thead className="thead-dark">
                      <tr>
                        <th scope="col">Sr.No</th>
                        <th scope="col">Candidate</th>
                        <th scope="col">Date</th>
                        <th scope="col">Time</th>
                        <th scope="col">Applied Job</th>
                        <th scope="col">Meeting Link</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {interviewSchedule.map((interview, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{interview.candidate}</td>
                          <td>{interview.date}</td>
                          <td>{interview.time}</td>
                          <td className="w-25">
                            {appliedJobs[interview.candidate_email]?.join(", ")}
                          </td>
                          <td>
                            <Link
                              to={interview.meetLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-primary"
                            >
                              Join Meeting
                            </Link>
                          </td>
                          <td>
                            <button
                              className="btn btn-secondary me-2"
                              onClick={() =>
                                handleViewClick(interview.candidate_email)
                              }
                            >
                              View
                            </button>
                            <button
                              className="btn btn-secondary"
                              onClick={() =>
                                handleViewResume(interview.candidate_email)
                              }
                            >
                              Resume
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ApplicantDetailsModal
        applicant={selectedApplicant || {}}
        show={showModal}
        onHide={() => setShowModal(false)}
      />
    </>
  );
}

export default InterviewerDashboard;
