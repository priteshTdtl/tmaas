import React, { useState, useEffect } from "react";
import axios from "axios";
import bcrypt from "bcryptjs";
import Sidebar from "../Misc/Sidebar";
import DashNavbar from "../Misc/DashNavbar";

function Create() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccessMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [successMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const hashedPassword = await bcrypt.hash(values.password, 10);

    axios
      .post("http://localhost:8000/students/create/", {
        ...values,
        password: hashedPassword,
      })
      .then((res) => {
        console.log(res);
        setSuccessMessage("User added successfully");
        setErrorMessage("");
        setValues({
          name: "",
          email: "",
          role: "",
          password: "",
        });
      })
      .catch((err) => {
        console.error(err);
        console.log(err.response);
        setSuccessMessage("");
        setErrorMessage("User already exists...");
      });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <DashNavbar />
      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar />
        <div style={{ flex: 1 }}>
          <div
            className=" auth-inner d-flex bg-light justify-content-center align-items-center"
            style={{ height: "80%", width: "45vw", marginTop: "6em" }}
          >
            <div className="w-100 rounded p-3">
              <form onSubmit={handleSubmit}>
                <h2 style={{ marginBottom: "5%" }}>Add User</h2>
                {successMessage && (
                  <div className="alert alert-success" role="alert">
                    {successMessage}
                  </div>
                )}
                {errorMessage && (
                  <div className="alert alert-danger" role="alert">
                    {errorMessage}
                  </div>
                )}
                <div className="mb-3 d-flex flex-column align-items-start">
                  <label className="mb-1">Name</label>
                  <input
                    type="text"
                    placeholder="Enter name"
                    className="form-control"
                    value={values.name}
                    onChange={(e) =>
                      setValues({ ...values, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-3 d-flex flex-column align-items-start">
                  <label className="mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="Enter email"
                    className="form-control"
                    value={values.email}
                    onChange={(e) =>
                      setValues({ ...values, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-3 d-flex flex-column align-items-start">
                  <label className="mb-1">Password</label>
                  <input
                    type="password"
                    placeholder="Enter password"
                    className="form-control"
                    value={values.password}
                    onChange={(e) =>
                      setValues({ ...values, password: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-3 d-flex flex-column align-items-start">
                  <label className="mb-1">Role</label>
                  <select
                    className="form-select"
                    value={values.role}
                    onChange={(e) =>
                      setValues({ ...values, role: e.target.value })
                    }
                    required
                  >
                    <option value="">Select Role</option>
                    <option value="Admin">Admin</option>
                    <option value="HR">HR</option>
                    <option value="Candidate">Candidate</option>
                    <option value="Interviewer">Interviewer</option>
                  </select>
                </div>
                <button className="btn btn-success">Submit</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Create;
