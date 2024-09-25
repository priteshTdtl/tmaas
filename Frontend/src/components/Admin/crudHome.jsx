import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Sidebar from "../Misc/Sidebar";
import DashNavbar from "../Misc/DashNavbar";
import Active from "../../Assets/Active.jpg";
import Inactive from "../../Assets/Inactive3.png";
import Pagination from "react-bootstrap/Pagination";

export default function CrudHome() {
  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filteredResults = data.filter(
      (student) =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filteredResults);
  }, [data, searchQuery]);

  const fetchData = () => {
    axios
      .get("http://localhost:8000/students/")
      .then((res) => {
        setData(res.data);
        setMessage("");
      })
      .catch((err) => console.log(err));
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8000/students/delete/${id}`)
      .then((res) => {
        // Filter out the deleted item from the data array
        const updatedData = data.filter((student) => student.id !== id);
        setData(updatedData);
        setMessage("Student account deleted successfully.");
        setTimeout(() => setMessage(""), 3000);
      })
      .catch((err) => console.log(err));
  };

  const confirmDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(id);
      }
    });
  };

  const handleActivate = (id) => {
    axios
      .put(`http://localhost:8000/students/activate/${id}/`)
      .then((res) => {
        // Fetch updated data after activation
        fetchData();
        setMessage("Student account activated successfully.");
        setTimeout(() => setMessage(""), 3000); // Clear message after 3 seconds
      })
      .catch((err) => console.log(err));
  };

  const handleDeactivate = (id) => {
    axios
      .put(`http://localhost:8000/students/deactivate/${id}/`)
      .then((res) => {
        fetchData();
        setMessage("Student account deactivated successfully.");
        setTimeout(() => setMessage(""), 3000);
      })
      .catch((err) => console.log(err));
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <div
        style={{ display: "flex", flexDirection: "column", height: "100vh" }}
      >
        <DashNavbar />
        <div style={{ display: "flex", flex: 1 }}>
          <Sidebar />
          <div className="container adminuserlist ">
            <div className="d-flex justify-content-center align-items-center mt-2">
              <div className="auth-inner w-100">
                <div className="container">
                  <div className="row justify-content-center">
                    <div className="col-lg-12">
                      <div className="bg-white rounded ">
                        <h2 className="display-6 gradient-text mb-4">
                          Manage Users
                        </h2>
                        <div className="d-flex justify-content-center ">
                          <div className="input-group search2">
                            <div className="form-outline w-100">
                              <input
                                type="search"
                                className="form-control"
                                placeholder="Search by Name, Email, or Role"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                              />
                              <button
                                className="btn btn-primary searchicon"
                                type="button"
                              >
                                <i className="fas fa-search"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="d-flex justify-content-end mb-3 ">
                          <Link to="/create" className="btn btn-success">
                            Create+
                          </Link>
                        </div>

                        {message && (
                          <div className="alert alert-success">{message}</div>
                        )}
                        <div className="table-responsive">
                          <table className="table">
                            <thead>
                              <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {currentItems.map((student, index) => (
                                <tr key={index}>
                                  <td>{student.id}</td>
                                  <td>{student.name}</td>
                                  <td>{student.email}</td>
                                  <td>{student.role}</td>
                                  <td>
                                    {student.account_status === "Active" ? (
                                      <img
                                        src={Active}
                                        alt="Active"
                                        style={{ height: 27, width: 27 }}
                                      />
                                    ) : (
                                      <img
                                        src={Inactive}
                                        alt="Inactive"
                                        style={{ height: 27, width: 27 }}
                                      />
                                    )}
                                  </td>
                                  <td>
                                    <Link
                                      to={`/read/${student.id}`}
                                      className="btn btn-sm btn-info me-2"
                                    >
                                      <i className="fa-solid fa-book" />
                                    </Link>
                                    <Link
                                      to={`/edit/${student.id}`}
                                      className="btn btn-sm btn-primary me-2"
                                    >
                                      <i className="fa-solid fa-pen" />
                                    </Link>
                                    <button
                                      onClick={() => confirmDelete(student.id)}
                                      className="btn btn-sm btn-danger me-2"
                                    >
                                      <i className="fa-solid fa-trash" />
                                    </button>
                                    {student.account_status === "Active" ? (
                                      <button
                                        onClick={() =>
                                          handleDeactivate(student.id)
                                        }
                                        className="btn btn-sm btn-warning me-2"
                                      >
                                        Inactive
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() =>
                                          handleActivate(student.id)
                                        }
                                        className="btn btn-sm btn-success me-2 pe-3"
                                      >
                                        Active
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <Pagination>
                          <Pagination.Prev
                            onClick={() =>
                              setCurrentPage((prev) =>
                                prev > 1 ? prev - 1 : prev
                              )
                            }
                          />
                          {Array.from(
                            {
                              length: Math.ceil(
                                filteredData.length / itemsPerPage
                              ),
                            },
                            (_, index) => (
                              <Pagination.Item
                                key={index}
                                active={index + 1 === currentPage}
                                onClick={() => paginate(index + 1)}
                              >
                                {index + 1}
                              </Pagination.Item>
                            )
                          )}
                          <Pagination.Next
                            onClick={() =>
                              setCurrentPage((prev) =>
                                prev <
                                Math.ceil(filteredData.length / itemsPerPage)
                                  ? prev + 1
                                  : prev
                              )
                            }
                          />
                        </Pagination>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
