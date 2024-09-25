import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";
import Login from "./components/Authentication/login.component";
import SignUp from "./components/Authentication/signup.component";
import Dashboard from "./components/Misc/dashboard.component";
import ForgotPass from "./components/Authentication/ForgotPassword.component";
import PasswordResetPage from "./components/Authentication/PasswordResetPage.component";
import AuthService from "./components/Authentication/authService";
import Home from "./components/Misc/home.component";
import PDFViewer from "./components/Misc/PDFViewer";
import Jobposting from "./components/Misc/Jobposting";
import Jobpostingresult from "./components/Misc/Jobpostingresult.component";
import Feedback from "./components/Misc/feedback.component";
import FeedbackList from "./components/Misc/feedbackList.component";
import Create from "./components/Admin/Create";
import Read from "./components/Admin/Read";
import Update from "./components/Admin/Update";
import CrudHome from "./components/Admin/crudHome";
import Jobapplication from "./components/ProfileForm/Jobapplication";
import Jobapplicationresult from "./components/ProfileForm/Jobapplicationresult";
import PersonalityQuizForm from "./components/PersonalityQuizForm";
import Showpdf from "./components/Misc/showpdf"
import TextComparisonPage from "./components/Misc/resumeScore";
import InterviewSchedule from "./components/Misc/InterviewSchedule";
import OfferLetter from "./components/Misc/OfferLetter";
import OfferLetterGenerator from "./components/Misc/Letter";
import RejectionLetter from "./components/Misc/RejectionLetter";
import AdminDashboard from "./components/Misc/AdminDashboard.component";
import HRDashboard from "./components/Misc/HRDashboard";
import InterviewerDashboard from "./components/Misc/InterviewerDashboard";
import InterviewerForm from "./components/Misc/InterviewerForm";
import EvaluationForm from "./components/Misc/EvaluationForm";
import InterviewerDetailList from "./components/Misc/InterviewerDetailList";
import InterviewerFeedback from "./components/Misc/InterviewerFeedback";



const PrivateRoute = ({ element, roles }) => {
  const isAuthenticated = localStorage.getItem("UserName");
  const userRole = localStorage.getItem("User_Role");

  if (isAuthenticated && roles.includes(userRole)) {
    return element;
  }
  else if (isAuthenticated && userRole === "Candidate") {
    return <Navigate to="/dashboard" replace />;
  }
  else if (isAuthenticated && userRole === "Interviewer") {
    return <Navigate to="/InterviewerDashboard" replace />;
  }
  else if (isAuthenticated && userRole === "HR") {
    return <Navigate to="/Admindashboard" replace />;
  }
  else if (isAuthenticated && userRole === "Admin") {
    return <Navigate to="/Admindashboard" replace />;
  }
  else {
    return <Navigate to="/sign-in" replace />;
  }
};

function App() {
  useEffect(() => {
    AuthService.initializeAuth();
  }, []);

  let [info, setInfo] = useState({
    jobTitle: "",
    description: "",
    vacancies: "",
    criteria: "",
  });

  function settingInfo(one, two, three, four) {
    let temp = { ...info };
    temp.jobTitle = one;
    temp.description = two;
    temp.vacancies = three;
    temp.criteria = four;
    setInfo(temp);
    console.log(info);
  }

  useEffect(() => {
    // Initialize authentication state
    AuthService.initializeAuth();
  }, []);

  return (
    <>

      <Router>
        <div className="App">
          <Routes>
            {/* CRUD paths */}
            <Route path="/crudHome" element={<PrivateRoute element={<CrudHome />} roles={["Admin", "HR"]} />} />
            <Route path="/create" element={<PrivateRoute element={<Create />} roles={["Admin", "HR"]} />} />
            <Route path="/read/:id" element={<PrivateRoute element={<Read />} roles={["Admin", "HR"]} />} />
            <Route path="/edit/:id" element={<PrivateRoute element={<Update />} roles={["Admin", "HR"]} />} />

            {/* Other paths */}
            <Route exact path="/" element={<Home />} />
            <Route path="/sign-in" element={<Login />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/HRDashboard" element={<PrivateRoute element={<HRDashboard />} roles={["Admin", "HR"]} />} />
            <Route path="/Admindashboard" element={<PrivateRoute element={<AdminDashboard />} roles={["Admin"]} />} />
            <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} roles={["Admin", "HR", "Candidate", "Interviewer"]} />} />
            <Route path="/forgotPass" element={<ForgotPass />} />
            <Route path="/newPass/:uidb64/:token" element={<PasswordResetPage />} />
            <Route path="/pdf-viewer" element={<PrivateRoute element={<PDFViewer />} roles={["Admin", "HR", "Candidate"]} />} />
            <Route path="/Jobposting" element={<PrivateRoute element={<Jobposting settingInfo={settingInfo} />} roles={["Admin", "HR"]} />} />
            <Route path="/Jobpostingresult" element={<PrivateRoute element={<Jobpostingresult info={info} />} roles={["Admin", "HR", "Candidate"]} />} />
            <Route path="/jobapplication" element={<PrivateRoute element={<Jobapplication />} roles={["Admin", "HR", "Candidate"]} />} />
            <Route path="/jobapplicationresult" element={<PrivateRoute element={<Jobapplicationresult />} roles={["Admin", "HR"]} />} />
            <Route path="/feedback" element={<PrivateRoute element={<Feedback />} roles={["Admin", "HR", "Candidate", "Interviewer"]} />} />
            <Route path="/feedback-list" element={<PrivateRoute element={<FeedbackList />} roles={["Admin", "HR"]} />} />
            <Route path="/showpdf" element={<PrivateRoute element={<Showpdf />} roles={["Admin", "HR"]} />} />
            <Route path="/resumescore" element={<PrivateRoute element={<TextComparisonPage />} roles={["Admin", "HR"]} />} />
            <Route path="/interviewSchedule" element={<PrivateRoute element={<InterviewSchedule />} roles={["Admin", "HR"]} />} />
            <Route path="/letterform" element={<PrivateRoute element={<OfferLetterGenerator />} roles={["Admin", "HR"]} />} />
            <Route path="/offerletter" element={<PrivateRoute element={<OfferLetter />} roles={["Admin", "HR"]} />} />
            <Route path="/RejectionLetter" element={<PrivateRoute element={<RejectionLetter />} roles={["Admin", "HR"]} />} />
            <Route path="/personalityquizform" element={<PrivateRoute element={<PersonalityQuizForm />} roles={["Admin", "HR", "Candidate"]} />} />
            <Route path="/evaluationForm" element={<PrivateRoute element={<EvaluationForm />} roles={["Admin", "Interviewer", "HR"]} />} />
            <Route path="/InterviewerDashboard" element={<PrivateRoute element={<InterviewerDashboard />} roles={["Admin", "Interviewer"]} />} />
            <Route path="/InterviewerForm" element={<PrivateRoute element={<InterviewerForm />} roles={["Admin", "Interviewer"]} />} />
            <Route path="/InterviewerDetailList" element={<PrivateRoute element={<InterviewerDetailList />} roles={["Admin", "HR"]} />} />
            <Route path="/InterviewerFeedback" element={<PrivateRoute element={<InterviewerFeedback />} roles={["Admin", "HR"]} />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;

