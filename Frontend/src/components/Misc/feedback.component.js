import React, { useState } from "react";
import axios from "axios";
import DashNavbar from "./DashNavbar";
import "../css/dash.css";
import Swal from "sweetalert2";
import Sidebar from "./Sidebar";

export default function Feedback() {
  const [rating, setRating] = useState("");
  const [feedback, setFeedback] = useState("");
  const [ratingError, setRatingError] = useState("");

  const handleRatingChange = (event) => {
    setRating(event.target.value);
    setRatingError(""); // Clear rating error when a rating is selected
  };

  const handleFeedbackChange = (event) => {
    setFeedback(event.target.value);
  };

  const handleSubmit = async () => {
    if (!rating) {
      setRatingError("Please select your rating.");
      return;
    }

    try {
      await axios.post("http://localhost:8000/api/feedback/", {
        rating,
        feedback,
      });

      await Swal.fire({
        title: "Feedback Submitted!",
        text: "Thank you for your feedback!",
        icon: "success",
        timer: 1000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      setRating("");
      setFeedback("");
    } catch (error) {
      console.error(error);
      await Swal.fire({
        title: "Error",
        text: "An error occurred while submitting your feedback.",
        icon: "error",
        timer: 4000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  };
  return (
    <>
      <div
        style={{ display: "flex", flexDirection: "column", height: "100vh" }}
      >
        <DashNavbar />
        <div style={{ display: "flex", flex: 1 }}>
          <Sidebar />
          <div
            className="py-5 mt-5"
            style={{ width: "60vw", marginLeft: "25vw" }}
          >
            <div className="auth-inner w-100">
              <div className="mx-0 mx-sm-auto">
                <div className="card h-100">
                  <div className="card-header bg-dark">
                    <h5
                      className="card-title text-white mt-2"
                      id="exampleModalLabel"
                    >
                      Feedback request
                    </h5>
                  </div>
                  <div className="modal-body">
                    <div className="text-center">
                      <i className=" fa-4x mb-3 text-primary"></i>
                      <p className="mt-3">
                        <strong>Your opinion matters</strong>
                      </p>
                      <p>
                        Have some ideas how to improve our product?
                        <strong>Give us your feedback.</strong>
                      </p>
                    </div>

                    <hr />

                    <form className="px-3">
                      <div className="row">
                        <div className="col-md-4">
                          <p className="text-center">
                            <strong>Your rating: {rating}</strong>
                          </p>

                          <div className="form-check mb-2">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="exampleForm"
                              id="radio3Example1"
                              value="Very_Good"
                              onChange={handleRatingChange}
                              required
                            />
                            <label
                              className="form-check-label"
                              htmlFor="radio3Example1"
                            >
                              Very good
                            </label>
                          </div>
                          <div className="form-check mb-2">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="exampleForm"
                              id="radio3Example2"
                              value="Good"
                              onChange={handleRatingChange}
                              required
                            />
                            <label
                              className="form-check-label"
                              htmlFor="radio3Example2"
                            >
                              Good
                            </label>
                          </div>
                          <div className="form-check mb-2">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="exampleForm"
                              id="radio3Example3"
                              value="Medium"
                              onChange={handleRatingChange}
                              required
                            />
                            <label
                              className="form-check-label"
                              htmlFor="radio3Example3"
                            >
                              Medium
                            </label>
                          </div>
                          <div className="form-check mb-2">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="exampleForm"
                              id="radio3Example4"
                              value="Bad"
                              onChange={handleRatingChange}
                              required
                            />
                            <label
                              className="form-check-label"
                              htmlFor="radio3Example4"
                            >
                              Bad
                            </label>
                          </div>
                          <div className="form-check mb-2">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="exampleForm"
                              id="radio3Example5"
                              value="Very_Bad"
                              onChange={handleRatingChange}
                              required
                            />
                            <label
                              className="form-check-label"
                              htmlFor="radio3Example5"
                            >
                              Very bad
                            </label>
                          </div>
                          <div style={{ color: "red" }}>{ratingError}</div>
                        </div>

                        <div className="col-md-8">
                          <p className="text-center">
                            <strong>What could we improve?</strong>
                          </p>

                          <div className="form-outline mb-4">
                            <textarea
                              className="form-control"
                              id="form4Example3"
                              rows="4"
                              onChange={handleFeedbackChange}
                            ></textarea>
                            <label
                              className="form-label"
                              htmlFor="form4Example3"
                            >
                              Your feedback
                            </label>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className="card-footer text-center">
                    <button
                      type="button"
                      className="btn btn-outline-dark"
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
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
