import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Sidebar from "../Misc/Sidebar";
import DashNavbar from "../Misc/DashNavbar";

function ReadStudent() {
  const { id } = useParams();
  const [student, setStudent] = useState({});

  useEffect(() => {
    axios
      .get(`http://localhost:8000/students/read/${id}/`)
      .then((res) => {
        console.log(res);
        setStudent(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [id]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <DashNavbar />
      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar />
        <div style={{ flex: 1 }}>
          <div
            className="  auth-inner d-flex bg-light justify-content-center align-items-center"
            style={{ width: "45vw", height: "80%", marginTop: "6em" }}
          >
            <div className="w-100 rounded p-3">
              <h2>User Details</h2>
              <div className="p-3 d-flex flex-column align-items-start">
                <h4>ID:{student.id}</h4>
                <h4>Name:{student.name}</h4>
                <h4>Email:{student.email}</h4>
                <h4>Role:{student.role}</h4>
              </div>
              <Link to="/crudHome" className="btn btn-primary me-2">
                Back
              </Link>
              <Link to={`/edit/${student.id}`} className="btn btn-info">
                Edit
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReadStudent;
