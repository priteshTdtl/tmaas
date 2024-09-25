import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Sidebar from "./Sidebar";
import DashNavbar from "./DashNavbar";

export default function InterviewerForm() {
  const [formData, setFormData] = useState({
    name: "",
    employee_id: "",
    phone: "",
    email: "",
    skills: "",
    experience: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/interviewer_details/",
        formData
      );
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Profile submitted successfully!",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  useEffect(() => {
    const storedName = localStorage.getItem("UserName");
    const storedEmail = localStorage.getItem("email");
    if (storedName && storedEmail) {
      setFormData({
        ...formData,
        name: storedName,
        email: storedEmail,
      });
    }
  }, []);

  return (
    <>
      <div
        style={{ display: "flex", flexDirection: "column", height: "100vh" }}
      >
        <DashNavbar />
        <div style={{ display: "flex", flex: 1 }}>
          <Sidebar />
          <div className="container mt-2">
            <div
              className="row justify-content-center ms-lg-5 pt-lg-4 mt-lg-5 ms-md-5 mt-sm-5 ps-sm-5 pt-sm-5 ps-1 ms-4 mt-5 pt-5"
              style={{ width: "100%" }}
            >
              <div className="col-md-8 col-9 auth-inner">
                <h2 className="display-6 gradient-text mb-4 ">
                  Interviewer Details
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <div className="row justify-content-center align-items-center">
                      <div className="col-md-6">
                        <label className="form-label text-end pe-3">
                          Name:
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          readOnly
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-end pe-3">
                          Employee ID:
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="employee_id"
                          placeholder="Enter Org Employee id"
                          value={formData.employee_id}
                          onChange={handleChange}
                          pattern="[0-9]*"
                          title="Please enter only numbers"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="row justify-content-center align-items-center">
                      <div className="col-md-6">
                        <label className="form-label text-end pe-3">
                          Phone:
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="phone"
                          placeholder="Enter 10 digit Phone No."
                          value={formData.phone}
                          onChange={handleChange}
                          pattern="[0-9]{10}"
                          title="Please enter a 10-digit phone number"
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-end pe-3">
                          Email:
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="row justify-content-center align-items-center">
                      <div className="col-md-6">
                        <label className="form-label text-end pe-3">
                          Skills:
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="skills"
                          placeholder="Enter comma separated values"
                          value={formData.skills}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-end pe-3">
                          Experience:
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="experience"
                          placeholder="Enter total years of experience"
                          value={formData.experience}
                          onChange={handleChange}
                          pattern="[0-9]{1,2}"
                          title="Please enter up to 2 digits"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-3 pt-4">
                    <div className="row justify-content-center">
                      <div className="col-md-6">
                        <button type="submit" className="btn btn-primary w-100">
                          Submit & Update
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
