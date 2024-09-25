import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

export default function Sidebar() {
  const userRole = localStorage.getItem("User_Role");
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth >= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* /////////////////////////////////Admin Sidebar//////////////////////////////////////////// */}
      {userRole === "Admin" && (
        <div className={`d-flex flex-column ${isOpen ? "sidebar-open" : ""}`}>
          <nav
            className={`flex-column sidebar  h-100 ${isOpen ? "open" : ""}`}
            style={{
              width: isOpen ? "12rem" : "4rem",
              minWidth: isOpen ? "12rem" : "4rem",
            }}
          >
            <div className="d-md-none">
              <button className="btn btn-dark" onClick={toggleSidebar}>
                <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
              </button>
            </div>
            <ul className="nav nav-pills flex-column mb-auto text-start ">
              <li className="nav-item">
                <NavLink
                  className="nav-link bgside text-light"
                  activeClassName="active"
                  to="/Admindashboard"
                >
                  <i className="fas fa-home me-2"></i> {isOpen ? "Home" : ""}
                </NavLink>
              </li>

              {/* <li className="nav-item">
                <NavLink
                  className="nav-link bgside text-light"
                  activeClassName="active"
                  to="/pdf-viewer"
                >
                  <i className="fas fa-file-pdf me-2"></i>{" "}
                  {isOpen ? "Scan Pdf" : ""}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link bgside text-light"
                  activeClassName="active"
                  to="/feedback"
                >
                  <i className="fas fa-comments me-2"></i>{" "}
                  {isOpen ? "Feedback" : ""}
                </NavLink>
              </li> */}
              <li className="nav-item">
                <NavLink
                  className="nav-link bgside text-light"
                  activeClassName="active"
                  to="/Jobposting"
                >
                  <i className="fas fa-plus-square me-2"></i>{" "}
                  {isOpen ? "Job Posting" : ""}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link bgside text-light"
                  activeClassName="active"
                  to="/Jobpostingresult"
                >
                  <i className="fas fa-briefcase me-2"></i>{" "}
                  {isOpen ? "Job Openings" : ""}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link bgside text-light"
                  activeClassName="active"
                  to="/jobapplication"
                >
                  <i className="fas fa-user me-2"></i>{" "}
                  {isOpen ? "Create Profile" : ""}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link bgside text-light"
                  activeClassName="active"
                  to="/personalityquizform"
                >
                  <i className="fas fa-brain me-2"></i>{" "}
                  {isOpen ? "Personality Quiz" : ""}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link bgside text-light"
                  activeClassName="active"
                  to="/jobapplicationresult"
                >
                  <i className="fas fa-users me-2"></i>{" "}
                  {isOpen ? "Job Applicants" : ""}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link bgside text-light"
                  activeClassName="active"
                  to="/feedback-list"
                >
                  <i className="fas fa-list me-2"></i>{" "}
                  {isOpen ? "Feedback List" : ""}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link bgside text-light"
                  activeClassName="active"
                  to="/crudHome"
                >
                  <i className="fas fa-database me-2"></i>{" "}
                  {isOpen ? " CRUD" : ""}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link bgside text-light"
                  activeClassName="active"
                  to="/interviewSchedule"
                >
                  <i className="fas fa-list me-2"></i>{" "}
                  {isOpen ? "Schedule Interview" : ""}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link bgside text-white"
                  to="/letterform"
                >
                  <i className="fas fa-file-contract me-2"></i>{" "}
                  {isOpen ? "Offer Letter" : ""}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link bgside text-white"
                  to="/InterviewerForm"
                >
                  <i className="fas fa-file-text me-2"></i>{" "}
                  {isOpen ? "Interviewer Form" : ""}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link bgside text-white"
                  to="/evaluationForm"
                >
                  <i className="fas fa-file-text me-2"></i>{" "}
                  {isOpen ? "Evaluation Form" : ""}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link bgside text-white"
                  to="/InterviewerDetailList"
                >
                  <i className="fas fa-file-text me-2"></i>{" "}
                  {isOpen ? "Interviewers List" : ""}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link bgside text-white"
                  to="/InterviewerFeedback"
                >
                  <i className="fas fa-file-text me-2"></i>{" "}
                  {isOpen ? "Interview Evaluation " : ""}
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {/* /////////////////////////////////Candidate Sidebar//////////////////////////////////////////// */}

      {userRole === "Candidate" && (
        <div className={`d-flex flex-column ${isOpen ? "sidebar-open" : ""}`}>
          <nav
            className={`flex-column  sidebar  h-100 ${isOpen ? "open" : ""}`}
            style={{
              width: isOpen ? "12rem" : "4rem",
              minWidth: isOpen ? "12rem" : "4rem",
            }}
          >
            <div className="d-md-none">
              <button className="btn btn-dark" onClick={toggleSidebar}>
                <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
              </button>
            </div>
            <ul className="nav nav-pills flex-column mb-auto text-start ">
              <li className="nav-item">
                <NavLink
                  className="nav-link bgside text-light"
                  activeClassName="active"
                  to="/dashboard"
                >
                  <i className="fas fa-home me-2"></i> {isOpen ? "Home" : ""}
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  className="nav-link bgside text-light"
                  activeClassName="active"
                  to="/pdf-viewer"
                >
                  <i className="fas fa-file-pdf me-2"></i>{" "}
                  {isOpen ? "Scan Pdf" : ""}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link bgside text-light"
                  activeClassName="active"
                  to="/feedback"
                >
                  <i className="fas fa-comments me-2"></i>{" "}
                  {isOpen ? "Feedback" : ""}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link bgside text-light"
                  activeClassName="active"
                  to="/Jobpostingresult"
                >
                  <i className="fas fa-briefcase me-2"></i>{" "}
                  {isOpen ? "Job Openings" : ""}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link bgside text-light"
                  activeClassName="active"
                  to="/jobapplication"
                >
                  <i className="fas fa-user me-2"></i>{" "}
                  {isOpen ? "Create Profile" : ""}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link bgside text-light"
                  activeClassName="active"
                  to="/personalityquizform"
                >
                  <i className="fas fa-brain me-2"></i>{" "}
                  {isOpen ? "Personality Quiz" : ""}
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {/* /////////////////////////////////HR Sidebar//////////////////////////////////////////// */}

      {userRole === "HR" && (
        <div className={`d-flex flex-column ${isOpen ? "sidebar-open" : ""}`}>
          <nav
            className={`flex-column  sidebar h-100 ${isOpen ? "open" : ""}`}
            style={{
              width: isOpen ? "12rem" : "4rem",
              minWidth: isOpen ? "12rem" : "4rem",
            }}
          >
            <div className="d-md-none">
              <button className="btn btn-dark" onClick={toggleSidebar}>
                <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
              </button>
            </div>
            <ul className="nav nav-pills flex-column mb-auto text-start ">
              <li className="nav-item">
                <NavLink
                  className="nav-link bgside text-light"
                  activeClassName="active"
                  to="/HRDashboard"
                >
                  <i className="fas fa-home me-2"></i> {isOpen ? "Home" : ""}
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  className="nav-link bgside text-light"
                  activeClassName="active"
                  to="/pdf-viewer"
                >
                  <i className="fas fa-file-pdf me-2"></i>{" "}
                  {isOpen ? "Scan Pdf" : ""}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link bgside text-light"
                  activeClassName="active"
                  to="/feedback"
                >
                  <i className="fas fa-comments me-2"></i>{" "}
                  {isOpen ? "Feedback" : ""}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link bgside text-light"
                  activeClassName="active"
                  to="/Jobposting"
                >
                  <i className="fas fa-plus-square me-2"></i>{" "}
                  {isOpen ? "Job Posting" : ""}
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  className="nav-link bgside text-light"
                  activeClassName="active"
                  to="/jobapplicationresult"
                >
                  <i className="fas fa-users me-2"></i>{" "}
                  {isOpen ? "Job Applicants" : ""}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link bgside text-light"
                  activeClassName="active"
                  to="/feedback-list"
                >
                  <i className="fas fa-list me-2"></i>{" "}
                  {isOpen ? "Feedback List" : ""}
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  className="nav-link bgside text-light"
                  activeClassName="active"
                  to="/interviewSchedule"
                >
                  <i className="fas fa-list me-2"></i>{" "}
                  {isOpen ? "Schedule Interview" : ""}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link bgside text-white"
                  activeClassName="active"
                  to="/letterform"
                >
                  <i className="fas fa-file-contract me-2"></i>{" "}
                  {isOpen ? "Offer Letter" : ""}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link bgside text-white"
                  to="/InterviewerFeedback"
                >
                  <i className="fas fa-file-text me-2"></i>{" "}
                  {isOpen ? "Interview Evaluation " : ""}
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {/* /////////////////////////////////Interviewer Sidebar//////////////////////////////////////////// */}

      {userRole === "Interviewer" && (
        <div className={`d-flex flex-column ${isOpen ? "sidebar-open" : ""}`}>
          <nav
            className={`flex-column bg-dark sidebar h-100 ${
              isOpen ? "open" : ""
            }`}
            style={{
              width: isOpen ? "12rem" : "4rem",
              minWidth: isOpen ? "12rem" : "4rem",
            }}
          >
            <div className="d-md-none">
              <button className="btn btn-dark" onClick={toggleSidebar}>
                <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
              </button>
            </div>
            <ul className="nav nav-pills flex-column mb-auto text-start ">
              <li className="nav-item">
                <NavLink
                  className="nav-link bgside text-light"
                  activeClassName="active"
                  to="/InterviewerDashboard"
                >
                  <i className="fas fa-home me-2"></i> {isOpen ? "Home" : ""}
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  className="nav-link bgside text-light"
                  activeClassName="active"
                  to="/feedback"
                >
                  <i className="fas fa-comments me-2"></i>{" "}
                  {isOpen ? "Feedback" : ""}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link bgside text-white"
                  to="/InterviewerForm"
                >
                  <i className="fas fa-file-text me-2"></i>{" "}
                  {isOpen ? "Interviewer Form" : ""}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link bgside text-white"
                  to="/evaluationForm"
                >
                  <i className="fas fa-file-text me-2"></i>{" "}
                  {isOpen ? "Evaluation Form" : ""}
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}
