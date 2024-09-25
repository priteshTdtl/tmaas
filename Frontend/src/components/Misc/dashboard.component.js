import React, { Component } from "react";
import { Link } from "react-router-dom";
import DashNavbar from "./DashNavbar";
import Sidebar from "./Sidebar";
import "../css/dash.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/PDFViewer.css";
import Swal from "sweetalert2";

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jobApplications: [],
    };
  }

  componentDidMount() {
    this.fetchApplicantData();
  }

  fetchApplicantData = () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      console.error("User ID not found in local storage");
      return;
    }

    fetch(`http://127.0.0.1:8000/applicants/${userId}/job-applications/`)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error(data.error);
        } else {
          this.setState({
            jobApplications: data,
          });
        }
      })
      .catch((error) => console.error("Error fetching applicant data:", error));
  };
  formatJobStatus = (status) => {
    switch (status) {
      case "under_review":
        return "Under Review";
      case "interview_scheduled":
        return "Interview Scheduled";
      case "selected":
        return "Selected";
      case "rejected":
        return "Rejected";
      default:
        return "Applied";
    }
  };

  formatDate = (dateString) => {
    if (!dateString) {
      const currentDate = new Date();
      const options = { year: "numeric", month: "short", day: "numeric" };
      return currentDate.toLocaleDateString(undefined, options);
    } else {
      const options = { year: "numeric", month: "short", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options);
    }
  };

  handleWithdraw = (jobApplicationId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once withdrawn, you cannot undo this action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Withdraw",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(
          `http://127.0.0.1:8000/job-applications/${jobApplicationId}/withdraw/`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
          .then((response) => {
            if (response.ok) {
              this.setState((prevState) => ({
                jobApplications: prevState.jobApplications.filter(
                  (jobApp) => jobApp.id !== jobApplicationId
                ),
              }));
              console.log("Job application withdrawn successfully");
            } else {
              console.error("Failed to withdraw job application");
            }
          })
          .catch((error) =>
            console.error("Error withdrawing job application:", error)
          );
      }
    });
  };

  render() {
    const { jobApplications } = this.state;

    return (
      <>
        <div
          style={{ display: "flex", flexDirection: "column", height: "100vh" }}
        >
          <DashNavbar />
          <div style={{ display: "flex", flex: 1 }}>
            <Sidebar />
            <div className="col-lg-10 col-md-8  col-sm-12  dash4 ">
              <div className="container mt-4  ">
                <div className="text-start ">
                  <h3 className="gradient-text">Welcome to your Dashboard</h3>
                  <p>
                    Below are your options for managing your profile and
                    reviewing the status of jobs you have applied to.
                  </p>
                  <h5>General Options</h5>
                </div>
                <div className="row mb-3 dashbtnm">
                  <div className="col-sm-6  text-start ">
                    <Link
                      to="/jobapplication"
                      className="btn btn-outline-dark btn-block"
                    >
                      <i className="fas fa-user me-2"></i>Update Profile
                    </Link>
                  </div>
                  <div className="col-sm-6  text-start">
                    <Link
                      to="/Jobpostingresult"
                      className="btn btn-outline-dark  btn-block"
                    >
                      <i className="fas fa-magnifying-glass me-2"></i>View
                      Opportunities
                    </Link>
                  </div>
                </div>

                <div className="auth-inner mt-5 w-100 ">
                  <h2 className="mb-4">Job Applications</h2>
                  <div className="table-responsive">
                    <table className="table">
                      <thead className="thead-dark">
                        <tr>
                          <th scope="col">Applied Job</th>
                          <th scope="col">Job Status</th>
                          <th scope="col">Last Update</th>
                          <th scope="col">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {jobApplications.map((jobApplication, index) => (
                          <tr key={index}>
                            <td>{jobApplication.job_title}</td>
                            <td>
                              {this.formatJobStatus(jobApplication.job_status)}
                            </td>
                            <td>
                              {this.formatDate(
                                jobApplication.status_update_time
                              )}
                            </td>
                            <td>
                              <button
                                className="btn btn-danger"
                                onClick={() =>
                                  this.handleWithdraw(jobApplication.id)
                                }
                              >
                                Withdraw
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
      </>
    );
  }
}
