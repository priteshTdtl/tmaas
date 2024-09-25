import React, { useState, useEffect } from "react";
import axios from "axios";
import DashNavbar from "./DashNavbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/dash.css";
import Sidebar from "./Sidebar";

export default function FeedbackList() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 8;

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/feedback-list/")
      .then((response) => {
        setFeedbackList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching feedback data:", error);
      });
  }, []);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = feedbackList.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <div className="d-flex flex-column vh-100">
        <DashNavbar />
        <div className="d-flex flex-1">
          <Sidebar />
          <div className="container ">
            <div className="feedbacklist">
              <h2 className="mb-4">Feedback List</h2>

              <table className="table table-bordered table-striped">
                <thead className="thead-dark">
                  <tr>
                    <th scope="col" className="pe-4">
                      Rating
                    </th>
                    <th scope="col">Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  {feedbackList.map((feedback) => (
                    <tr key={feedback.id}>
                      <td>{feedback.rating}</td>
                      <td>{feedback.feedback}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
