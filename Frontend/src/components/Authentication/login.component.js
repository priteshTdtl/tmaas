import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import AuthService from "./authService";
import Navbar from "../Misc/Navbar";
import { Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = (event) => {
    event.preventDefault();

    const loginData = {
      email: formData.email,
      password: formData.password,
    };

    AuthService.login(loginData.email, loginData.password);

    axios
      .post("http://127.0.0.1:8000/Login_view/", loginData)
      .then((response) => {
        console.log("Login Successful:", response.data);

        const { user, message, error_message } = response.data;

        if (error_message) {
          Swal.fire({
            icon: "error",
            title: "Login Error",
            text: error_message,
          });
        } else if (user) {
          const { role } = user;
          const userName = user.name;
          const userId = user.id;
          localStorage.setItem("User_Role", role);
          localStorage.setItem("UserName", userName);
          localStorage.setItem("user_id", userId);
          localStorage.setItem("email", formData.email);
          Swal.fire({
            icon: "success",
            title: "Login Successful!",
            text: message || "Welcome!",
            timer: 1000,
            timerProgressBar: true,
            showConfirmButton: false,
          }).then(() => {
            if (role === "Admin") {
              navigate("/Admindashboard");
            } else if (role === "Candidate") {
              navigate("/dashboard");
            } else if (role === "Interviewer") {
              navigate("/InterviewerDashboard");
            } else if (role === "HR") {
              navigate("/HRDashboard");
            }
          });
        }
      })
      .catch((error) => {
        console.error("Login Error:", error.response);

        if (error.response.status === 403) {
          Swal.fire({
            title: "Login Error",
            html: '<span style="color: red;">Your account is inactive. Please contact the administrator.</span>',
            icon: "warning",
            backdrop: true,
            showConfirmButton: false,
            timer: 5000,
            timerProgressBar: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            showClass: {
              popup: "animate__animated animate__fadeIn",
            },
            hideClass: {
              popup: "animate__animated animate__fadeOut",
            },
            customClass: {
              popup: "custom-modal-class",
              title: "custom-title-class",
            },
            buttonsStyling: false,
            confirmButtonClass: "btn btn-warning",
            confirmButtonText: "OK",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Login Error",
            text: "Invalid email or password. Please try again.",
          });
        }
      });
  };

  return (
    <>
      <Navbar />
      <div className="auth-inner mt-5">
        <form onSubmit={handleLogin}>
          <h3>Sign In</h3>
          <div className="mb-3 d-flex flex-column align-items-start">
            <label>Email address</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-3 d-flex flex-column align-items-start">
            <label>Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-3 d-flex flex-column align-items-start">
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                id="customCheck1"
              />
              <label className="custom-control-label" htmlFor="customCheck1">
                Remember me
              </label>
            </div>
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>

          <p className="forgot-password text-right">
            Forgot <Link to="/forgotPass">password?</Link>
          </p>
        </form>
      </div>
    </>
  );
}
