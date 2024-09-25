import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Sidebar from "./Sidebar";
import DashNavbar from "./DashNavbar";

const Jobposting = (props) => {
  const [jobId, setJobId] = useState("");
  const [jobtitle, setJobTitle] = useState("");
  const [description, setDescription] = useState("");
  const [vacancies, setVacancies] = useState("");
  const [experience, setExperience] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [roleType, setRoleType] = useState("");
  const roleOptions = [
    { value: "Full Time", label: "Full Time" },
    { value: "Part Time", label: "Part Time" },
    { value: "Contractual", label: "Contractual" },
    { value: "Intern", label: "Intern" },
  ];

  const [newJobCount, setNewJobCount] = useState(0);
  const handleRoleChange = (e) => {
    const selectedValue = e.target.value;
    setRoleType(selectedValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    props.settingInfo(
      jobId,
      jobtitle,
      description,
      vacancies,
      experience,
      jobLocation,
      roleType
    );

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/JobPosting_view/",
        {
          job_id: jobId,
          jobtitle,
          description,
          vacancies,
          experience,
          job_location: jobLocation,
          role_type: roleType,
        }
      );

      // Increment new job count
      setNewJobCount(newJobCount + 1);

      await Swal.fire({
        title: "Job Posted!",
        text: "Your job has been successfully posted.",
        icon: "success",
        confirmButtonText: "OK",
      });

      console.log(response.data);

      setJobTitle("");
      setDescription("");
      setVacancies("");
      setExperience("");
      setJobLocation("");
      setRoleType("");
    } catch (error) {
      console.error("Error posting job:", error);

      Swal.fire({
        title: "Error",
        text: "An error occurred while posting the job.",
        icon: "error",
        confirmButtonText: "OK",
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
          <div className="container mt-2">
            <div
              className="row justify-content-center ms-lg-5 pt-lg-4 mt-lg-5 ms-md-5 mt-sm-5 ps-sm-5 pt-sm-5 ps-1 ms-4 mt-5 pt-5"
              style={{ width: "100%" }}
            >
              <div className="col-md-8 col-9 auth-inner">
                <h2 className="display-6 gradient-text mb-4 ">
                  Job Posting Form
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <div className="row justify-content-center align-items-center">
                      <div className="col-md-6">
                        <label className="form-label text-end pe-3">
                          Job ID:
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={jobId}
                          onChange={(e) => setJobId(e.target.value)}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-end pe-3">
                          Job Title:
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={jobtitle}
                          onChange={(e) => setJobTitle(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="row justify-content-center align-items-center">
                      <div className="col-md-6">
                        <label className="form-label text-end pe-3">
                          Vacancies:
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={vacancies}
                          onChange={(e) => {
                            const input = e.target.value;
                            if (/^\d*$/.test(input)) {
                              setVacancies(input);
                            }
                          }}
                          pattern="[0-9]*"
                          title="Please enter only numeric values"
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
                          value={experience}
                          onChange={(e) => {
                            const input = e.target.value;
                            if (/^[0-9.-]*(\s*years)?$/.test(input)) {
                              setExperience(input);
                            } else {
                              setExperience("");
                            }
                          }}
                          title="Enter a valid experience (e.g., 1.5 years or -2 years)"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="row justify-content-center align-items-center">
                      <div className="col-md-6">
                        <label className="form-label text-end pe-3">
                          Job Location:
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={jobLocation}
                          onChange={(e) => setJobLocation(e.target.value)}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-end pe-3">
                          Role Type:
                        </label>
                        <select
                          className="form-select"
                          id="autoSizingSelect"
                          value={roleType}
                          onChange={handleRoleChange}
                          required
                        >
                          <option value="" disabled>
                            Choose...
                          </option>
                          {roleOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="row justify-content-center align-items-center">
                      <div className="col-md-8">
                        <label className="form-label text-end pe-3">
                          Description:
                        </label>
                        <textarea
                          className="form-control"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-3 pt-4">
                    <div className="row justify-content-center ">
                      <div className="col-md-6 ">
                        <button type="submit" className="btn btn-primary w-100">
                          Post
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
};

export default Jobposting;
