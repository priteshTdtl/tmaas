import React, { useState } from "react";
import Navbar from "../Misc/Navbar";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";
import { Link } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    // Hash the password before sending it to the server
    const hashedPassword = await bcrypt.hash(formData.password, 10);

    const loginData = {
      name: formData.name,
      email: formData.email,
      password: hashedPassword, // Use the hashed password
    };

    axios
      .post("http://127.0.0.1:8000/Signup_view/", loginData)
      .then((response) => {
        console.log("SignUp Successful:", response.data);

        Swal.fire({
          icon: "success",
          title: "SignUp Successful!",
          text: "You can perform additional actions after successful signup.",
          timer: 1000,
          timerProgressBar: true,
          showConfirmButton: false,
        });

        navigate("/sign-in");
      })
      .catch((error) => {
        console.error("SignUp Error:", error);

        Swal.fire({
          icon: "error",
          title: "SignUp Error",
          text: "There was an error during signup. Please try again.",
          timer: 1000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      });
  };

  return (
    <>
      <Navbar />
      <div className="auth-inner mt-5">
        <form onSubmit={handleLogin}>
          <h3>Sign Up</h3>
          <div className="mb-3 d-flex flex-column align-items-start">
            <label className="mb-1">Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-3 d-flex flex-column align-items-start">
            <label className="mb-1">Email address</label>
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
            <label className="mb-1">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Create Account
            </button>
          </div>

          <p className="forgot-password text-right">
            Already registered <Link to="/sign-in">sign-in?</Link>
          </p>
        </form>
      </div>
    </>
  );
}
