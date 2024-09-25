import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import bcrypt from "bcryptjs";
import Sidebar from "../Misc/Sidebar";
import DashNavbar from "../Misc/DashNavbar";

function Update() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [values, setValues] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
  });
  const readUrl = `http://localhost:8000/students/read/${id}/`;
  const updateUrl = `http://localhost:8000/students/update/${id}/`;

  useEffect(() => {
    axios
      .get(readUrl)
      .then((res) => {
        const { password, ...userData } = res.data;
        setValues((prevValues) => ({
          ...prevValues,
          ...userData,
        }));
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, [readUrl]);

  const handleUpdate = async (event) => {
    event.preventDefault();

    let updatedValues = { ...values };
    if (values.password) {
      const hashedPassword = await bcrypt.hash(values.password, 10);
      updatedValues = {
        ...values,
        password: hashedPassword,
      };
    }

    axios
      .put(updateUrl, updatedValues)
      .then((res) => {
        console.log(res);
        navigate("/crudHome");
      })
      .catch((err) => console.log(err));
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
              <form onSubmit={handleUpdate}>
                <h2>Update User</h2>
                <div className="mb-3 d-flex flex-column align-items-start">
                  <label className="mb-1 px-3">Name</label>
                  <input
                    type="text"
                    placeholder="Enter name"
                    className="form-control"
                    value={values.name}
                    onChange={(e) =>
                      setValues({ ...values, name: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3 d-flex flex-column align-items-start">
                  <label className="mb-1 px-3">Email</label>
                  <input
                    type="email"
                    placeholder="Enter email"
                    className="form-control"
                    value={values.email}
                    onChange={(e) =>
                      setValues({ ...values, email: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3 d-flex flex-column align-items-start">
                  <label className="mb-1 px-3">Role</label>
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
                <div className="mb-3 d-flex flex-column align-items-start">
                  <label className="mb-1 px-3">Password</label>
                  <input
                    type="password"
                    placeholder="Enter password"
                    className="form-control"
                    value={values.password}
                    onChange={(e) =>
                      setValues({ ...values, password: e.target.value })
                    }
                  />
                </div>
                <Link to="/crudHome" className="btn btn-primary me-2">
                  Back
                </Link>
                <button className="btn btn-success">Update</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Update;
