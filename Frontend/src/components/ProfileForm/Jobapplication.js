import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import "survey-core/defaultV2.min.css";
import "../css/index.css";
import axios from "axios";
import Swal from "sweetalert2";
import DashNavbar from "../Misc/DashNavbar";
import Sidebar from "../Misc/Sidebar";
import ProgressBar from "react-bootstrap/ProgressBar";

function getColor(progress) {
  if (progress >= 0 && progress < 25) {
    return "danger";
  } else if (progress >= 25 && progress < 50) {
    return "warning";
  } else if (progress >= 50 && progress < 75) {
    return "primary";
  } else {
    return "success";
  }
}

function Jobapplication(props) {
  const [resume, setResume] = useState(null);
  const [resumePath, setResumePath] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    resume: "",
  });
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const userEmail = localStorage.getItem("email");
    if (userEmail) {
      setFormData({ ...formData, email: userEmail });
      fetchData(userEmail);
    }
  }, []);

  async function fetchData(userEmail) {
    try {
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        console.error("User ID not found in localStorage");
        return;
      }

      const response = await axios.get(
        `http://127.0.0.1:8000/applicants/data/?user_id=${userId}`
      );
      const responseData = response.data[0];
      const applicantFields = responseData.fields;
      setFormData((prevState) => ({
        ...prevState,
        ...applicantFields,
      }));
      if (applicantFields.resume) {
        setResumePath(applicantFields.resume);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    updateProgress();
  }, [formData]);

  function updateProgress() {
    console.log(formData);
    // const totalQuestions = survey.getAllQuestions().length;
    const answeredQuestions = Object.keys(formData).filter(
      (key) => !!formData[key]
    ).length;
    const calculatedProgress = (answeredQuestions / 43) * 100;
    setProgress(calculatedProgress);
  }
  function handleSurveyCompletion(sender, options) {
    const surveyData = sender.data;
    const userId = localStorage.getItem("user_id");

    const emailform = surveyData.email;

    const formData = new FormData();

    const newResumeUploaded = !!resumeFile;

    formData.append("resumePath", resumePath);

    if (!newResumeUploaded && !resumePath) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Please upload your resume.",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      return;
    }
    if (newResumeUploaded) {
      formData.append("resume", resumeFile);
    }
    Object.entries(surveyData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    formData.append("user_id", userId);

    const backendUrl = "http://127.0.0.1:8000/update_applicant/";
    axios
      .post(backendUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const calculatedProgress = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          );
          setProgress(calculatedProgress);
        },
      })
      .then((response) => {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Your job profile has been updated successfully.",
          timer: 1000,
          timerProgressBar: true,
          showConfirmButton: false,
        }).then(() => {
          navigate("/jobpostingresult");
        });
        console.log("Response:", response.data);
      })
      .catch((error) => {
        console.error("Error:", error);

        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "An error occurred while updating your job profile. Please try again.",
          timer: 1000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      });
  }

  const survey = new Model({
    elements: [
      {
        type: "panel",
        name: "personal-info",
        title: "Personal Information",
        elements: [
          {
            type: "text",
            name: "first_name",
            title: "First name",
            defaultValue: formData.first_name,
            isRequired: true,
          },
          {
            type: "text",
            name: "last_name",
            startWithNewLine: false,
            title: "Last name",
            defaultValue: formData.last_name,
            isRequired: true,
          },

          {
            type: "text",
            name: "email",
            title: "Email",
            inputType: "email",
            placeholder: "mail@example.com",
            defaultValue: formData.email,
            readOnly: true,
          },
          {
            type: "text",
            name: "phone",
            title: "Phone Number",
            inputType: "tel",
            placeholder: "Enter 10-digit phone number",
            defaultValue: formData.phone,
            isRequired: true,
            validators: [
              {
                type: "numeric",
                text: "Please enter a valid 10-digit phone number",
                validate: (value, survey) => {
                  const isValidLength = value.length <= 10;
                  const isValidFormat = /^\d{10}$/.test(value);
                  return isValidLength && isValidFormat
                    ? null
                    : "Please enter exactly 10 digits for the phone number";
                },
              },
            ],
            startWithNewLine: false,
            inputClass: "sv_q_inline",
          },
        ],
      },
      {
        type: "panel",
        name: "location",
        title: "Addresses",

        elements: [
          {
            type: "dropdown",
            name: "address_type",
            title: "Type of Address",
            defaultValue: formData.address_type,
            choices: [
              {
                value: "home",
                text: "Home",
              },
              {
                value: "other",
                text: "Other",
              },
            ],
          },
          {
            type: "text",
            name: "street_address",
            title: "Street Address",
            startWithNewLine: false,
            defaultValue: formData.street_address,
            inputClass: "sv_q_inline",
          },
          {
            type: "text",
            name: "city",
            title: "City",
            defaultValue: formData.city,
          },
          {
            type: "dropdown",
            name: "country",
            title: "Country",
            defaultValue: formData.country,
            choicesByUrl: {
              url: "https://surveyjs.io/api/CountriesExample",
            },
            startWithNewLine: false,
            inputClass: "sv_q_inline",
          },
          {
            type: "text",
            name: "state",
            title: "State",
            defaultValue: formData.state,
            choices: [
              "Andhra Pradesh",
              "Arunachal Pradesh",
              "Assam",
              "Bihar",
              "Chhattisgarh",
              "Goa",
              "Gujarat",
              "Haryana",
              "Himachal Pradesh",
              "Jharkhand",
              "Karnataka",
              "Kerala",
              "Madhya Pradesh",
              "Maharashtra",
              "Manipur",
              "Meghalaya",
              "Mizoram",
              "Nagaland",
              "Odisha",
              "Punjab",
              "Rajasthan",
              "Sikkim",
              "Tamil Nadu",
              "Telangana",
              "Tripura",
              "Uttar Pradesh",
              "Uttarakhand",
              "West Bengal",
            ],
            startWithNewLine: false,
            inputClass: "sv_q_inline",
          },

          {
            type: "text",
            name: "zip_code",
            startWithNewLine: false,
            title: "Zip code",
            inputType: "number",
            defaultValue: formData.zip_code,
            validators: [
              {
                type: "numeric",
              },
            ],
          },
        ],
      },

      {
        type: "panel",
        elements: [
          {
            type: "dropdown",
            name: "relocating",
            title: "Are you open to relocating to Job Location?",
            defaultValue: formData.relocating,
            choices: [
              {
                value: "yes",
                text: "Yes",
              },
              {
                value: "no",
                text: "No",
              },
            ],
          },
          {
            type: "dropdown",
            name: "employed_with_datetech",
            title:
              "Have you ever been employed with The Datetech Lab or its subsidiaries?",
            defaultValue: formData.employed_with_datetech,
            choices: [
              {
                value: "yes",
                text: "Yes",
              },
              {
                value: "no",
                text: "No",
              },
            ],
            startWithNewLine: false,
            inputClass: "sv_q_inline",
          },

          {
            type: "text",
            name: "employee_id",
            title: "If yes, please provide your Employee ID. If no, enter N/A",
            defaultValue: formData.employee_id,
          },
          {
            type: "text",
            name: "birthdate",
            title: "Date of birth",
            inputType: "date",
            defaultValue: formData.birthdate,
            isRequired: true,
            startWithNewLine: false,
            inputClass: "sv_q_inline",
          },
          {
            type: "dropdown",
            name: "employed_with_govt",
            title:
              "Are you currently employed with government or government agency in any capacity or were employed in the last 12 months ? ",
            defaultValue: formData.employed_with_govt,
            choices: [
              {
                value: "yes",
                text: "Yes",
              },
              {
                value: "no",
                text: "No",
              },
            ],
          },

          {
            type: "dropdown",
            name: "how_did_you_hear",
            title: "How did you hear about us?",
            defaultValue: formData.how_did_you_hear,
            choices: [
              {
                value: "alumni",
                text: "Alumni",
              },
              {
                value: "website",
                text: "Company Website",
              },
              {
                value: "conversion",
                text: "Conversion",
              },
              {
                value: "source",
                text: "Direct Source",
              },
              {
                value: "govt",
                text: "Government",
              },
              {
                value: "jobboard",
                text: "Job Board",
              },
              {
                value: "socialmedia",
                text: "Social Media",
              },
              {
                value: "other",
                text: "Other",
              },
            ],
          },
          {
            type: "text",
            name: "specify_hear",
            title: "Please specify further",
            startWithNewLine: false,
            inputClass: "sv_q_inline",
            defaultValue: formData.specify_hear,
          },
        ],
      },

      {
        type: "panel",
        name: "education_info",
        title: "Education",

        elements: [
          {
            type: "dropdown",
            name: "degree",
            title: "Degree",
            defaultValue: formData.degree,
            choices: [
              "Bachelor's Degree",
              "AI&ML",
              "Data Science",
              "Master's Degree",
              "Ph.D.",
              "Associate Degree",
              "High School Diploma",
              "Vocational/Technical Degree",
              "Professional Certification",
              "Doctor of Medicine (MD)",
              "Doctor of Dental Surgery (DDS)",
              "Juris Doctor (JD)",
              "Bachelor of Science in Engineering",
              "Bachelor of Arts",
              "Bachelor of Fine Arts",
              "Bachelor of Business Administration",
              "Bachelor of Computer Science",
              "Master of Science",
              "Master of Business Administration",
              "Master of Arts",
              "Doctor of Philosophy (Ph.D.) in [Your Field]",
              "Other",
            ],
            isRequired: true,
            startWithNewLine: false,
            inputClass: "sv_q_inline",
          },
          {
            type: "text",
            name: "specify_degree",
            title: "Please specify further",
            startWithNewLine: false,
            inputClass: "sv_q_inline",
            placeHolder: "Enter other degree here",
            defaultValue: formData.specify_degree,
          },

          {
            type: "text",
            name: "college",
            title: "College/University",
            startWithNewLine: false,
            inputClass: "sv_q_inline",
            defaultValue: formData.college,
            isRequired: true,
          },
          {
            type: "dropdown",
            name: "branch",
            title: "Branch of Study",
            startWithNewLine: false,
            inputClass: "sv_q_inline",
            defaultValue: formData.branch,
            isRequired: true,
            choices: [
              "Computer Science",
              "Electrical Engineering",
              "Mechanical Engineering",
              "Civil Engineering",
              "Chemical Engineering",
              "Biomedical Engineering",
              "Mathematics",
              "Physics",
              "Chemistry",
              "Biology",
              "Economics",
              "Psychology",
              "Sociology",
              "Other",
            ],
          },
          {
            type: "text",
            name: "graduation_date",
            title: "Graduation Date / Year of Passing ",
            isRequired: true,
            inputType: "date",
            startWithNewLine: false,
            inputClass: "sv_q_inline",
            defaultValue: formData.graduation_date,
          },

          {
            type: "dropdown",
            name: "country_of_college",
            title: "Country",
            defaultValue: formData.country_of_college,
            choicesByUrl: {
              url: "https://surveyjs.io/api/CountriesExample",
            },
            startWithNewLine: false,
            inputClass: "sv_q_inline",
            isRequired: true,
          },
          {
            type: "text",
            name: "city_of_college",
            title: "City/Town",
            startWithNewLine: false,
            inputClass: "sv_q_inline",
            isRequired: true,
            defaultValue: formData.city_of_college,
          },
          {
            type: "text",
            name: "state_of_college",
            title: "State",
            isRequired: true,
            choices: [
              "Andhra Pradesh",
              "Arunachal Pradesh",
              "Assam",
              "Bihar",
              "Chhattisgarh",
              "Goa",
              "Gujarat",
              "Haryana",
              "Himachal Pradesh",
              "Jharkhand",
              "Karnataka",
              "Kerala",
              "Madhya Pradesh",
              "Maharashtra",
              "Manipur",
              "Meghalaya",
              "Mizoram",
              "Nagaland",
              "Odisha",
              "Punjab",
              "Rajasthan",
              "Sikkim",
              "Tamil Nadu",
              "Telangana",
              "Tripura",
              "Uttar Pradesh",
              "Uttarakhand",
              "West Bengal",
            ],
            startWithNewLine: false,
            inputClass: "sv_q_inline",
            defaultValue: formData.state_of_college,
          },
        ],
      },

      {
        type: "dropdown",
        name: "nationality",
        title: "Nationality",
        isRequired: true,
        defaultValue: formData.nationality,
        choices: [
          "American",
          "British",
          "Canadian",
          "Australian",
          "French",
          "German",
          "Italian",
          "Spanish",
          "Chinese",
          "Indian",
          "Japanese",
          "Brazilian",
          "Mexican",
          "Russian",
          "South African",
        ],
      },
      {
        type: "dropdown",
        name: "authorized_to_work",
        isRequired: true,
        title: "Are you legally authorized to work in the country?",
        choices: [
          {
            value: "yes",
            text: "Yes",
          },
          {
            value: "no",
            text: "No",
          },
        ],
        startWithNewLine: false,
        inputClass: "sv_q_inline",
        defaultValue: formData.authorized_to_work,
      },

      {
        type: "dropdown",
        name: "require_visa_sponsorship",
        title:
          "Will you now or in future require the company’s sponsorship for employment Visa (H1-B,TN,EAD,other work visa)?",
        choices: [
          {
            value: "yes",
            text: "Yes",
          },
          {
            value: "no",
            text: "No",
          },
        ],
        defaultValue: formData.require_visa_sponsorship,
      },

      {
        type: "panel",
        name: "work_experience",
        title: "Work Experience",
        elements: [
          {
            type: "text",
            name: "employer",
            title: "Employer",
            defaultValue: formData.employer,
          },
          {
            type: "text",
            name: "work_city",
            title: "City/Town",
            startWithNewLine: false,
            inputClass: "sv_q_inline",
            defaultValue: formData.work_city,
          },
          {
            type: "dropdown",
            name: "work_country",
            title: "Country",
            choicesByUrl: {
              url: "https://surveyjs.io/api/CountriesExample",
            },
            startWithNewLine: false,
            inputClass: "sv_q_inline",
            defaultValue: formData.work_country,
          },
          {
            type: "text",
            name: "work_state",
            title: "State",
            choices: [
              "Andhra Pradesh",
              "Arunachal Pradesh",
              "Assam",
              "Bihar",
              "Chhattisgarh",
              "Goa",
              "Gujarat",
              "Haryana",
              "Himachal Pradesh",
              "Jharkhand",
              "Karnataka",
              "Kerala",
              "Madhya Pradesh",
              "Maharashtra",
              "Manipur",
              "Meghalaya",
              "Mizoram",
              "Nagaland",
              "Odisha",
              "Punjab",
              "Rajasthan",
              "Sikkim",
              "Tamil Nadu",
              "Telangana",
              "Tripura",
              "Uttar Pradesh",
              "Uttarakhand",
              "West Bengal",
            ],
            startWithNewLine: false,
            inputClass: "sv_q_inline",
            defaultValue: formData.work_state,
          },
          {
            type: "text",
            name: "job_title",
            title: "Job Title",
            defaultValue: formData.job_title,
          },
          {
            type: "text",
            name: "work_start_date",
            title: "Start Date",
            inputType: "date",
            defaultValue: formData.work_start_date,
          },
          {
            type: "text",
            name: "work_end_date",
            title: "End Date",
            inputType: "date",
            startWithNewLine: false,
            inputClass: "sv_q_inline",
            defaultValue: formData.work_end_date,
          },
          {
            type: "text",
            name: "work_description",
            title: "Description",
            inputType: "textarea",
            defaultValue: formData.work_description,
            cols: 30,
            rows: 5,
          },
          {
            type: "text",
            name: "reason_for_leaving",
            title: "Reason for Leaving",
            inputType: "textarea",
            defaultValue: formData.reason_for_leaving,
            cols: 30,
            rows: 5,
            startWithNewLine: false,
            inputClass: "sv_q_inline",
          },
        ],
      },

      {
        type: "panel",
        elements: [
          {
            type: "text",
            name: "current_ctc",
            title: "Current CTC (in Rupee)",
            inputType: "number",
            validators: [
              {
                type: "numeric",
              },
            ],
            defaultValue: formData.current_ctc,
          },
          {
            type: "text",
            name: "total_experience_months",
            title: "Total Experience  (in months)",
            inputType: "number",
            startWithNewLine: false,
            inputClass: "sv_q_inline",
            defaultValue: formData.total_experience_months,
          },
          {
            type: "text",
            name: "current_notice_period_days",
            title: "Current Notice Period (days)",
            inputType: "number",
            defaultValue: formData.current_notice_period_days,
          },
          {
            type: "text",
            name: "skills",
            title: "Skill",
            inputType: "text",
            startWithNewLine: false,
            inputClass: "sv_q_inline",
            defaultValue: formData.skills,
          },
        ],
      },

      {
        type: "dropdown",
        name: "timezone",
        title: "Time Zone",
        isRequired: true,
        defaultValue: formData.timezone,
        choices: [
          { value: "UTC", text: "Coordinated Universal Time (UTC)" },
          { value: "GMT", text: "Greenwich Mean Time (GMT)" },
          { value: "EST", text: "Eastern Standard Time (EST)" },
          { value: "IST", text: "Indian Standard Time, IST" },
          { value: "JST", text: "Japan Standard Time, JST" },
          { value: "KST", text: "Korean Standard Time, KST" },
          { value: "SST", text: "Singapore Standard Time, SST" },
          { value: "MST", text: "Malaysia Standard Time, MST" },
          { value: "CST", text: "China Standard Time, CST" },
          { value: "PST", text: "Philippine Standard Time, PST" },
          { value: "ICT", text: "Indochina Time, ICT" },
          { value: "NPT", text: "Nepal Time, NPT" },
          { value: "WIB", text: "Western Indonesia Time, WIB" },
          { value: "HKT", text: "Hong Kong Standard Time, HKT" },
          { value: "SLT", text: "Sri Lanka Time, SLT" },
          { value: "GST", text: "Gulf Standard Time, GST)" },
          { value: "PST", text: "Pakistan Standard Time, PST" },
        ],
      },
    ],

    onUploadFiles: (sender, options) => {
      if (options.name === "resume") {
        setResume(options.files[0]);
      }
    },

    showQuestionNumbers: false,
    completeText: "Submit Profile",
    widthMode: "static",
    width: "1000px",
    showCompletedPage: false,
  });

  survey.onComplete.add(handleSurveyCompletion);

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  let [resumeFile, setResumeFile] = useState("");

  function handleResume(e) {
    let filePath = e.target.files[0];
    if (filePath) {
      setResumeFile(filePath);
      const formData = new FormData();
      formData.append("pdf_file", filePath);

      axios
        .post("http://127.0.0.1:8000/extract_text/", formData)
        .then((response) => {})
        .catch((error) => {
          console.error("Error extracting text from PDF:", error);
        });
    }
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflowY: "hidden",
        }}
      >
        <DashNavbar />
        <div style={{ display: "flex", flex: 1 }}>
          <Sidebar />
          <div className="container  submitform  ">
            <div style={{ overflow: "auto", height: "92.5vh" }}>
              <div className="" style={{ backgroundColor: "#f3f3f3" }}>
                <ProgressBar
                  animated
                  now={progress}
                  label={`${progress.toFixed(2)}%`}
                  className="my-3 mt-4"
                >
                  <ProgressBar
                    striped
                    variant={getColor(progress)}
                    animated
                    now={progress}
                    label={`${progress.toFixed(2)}%`}
                  />
                </ProgressBar>{" "}
                <h1 className="display-6 gradient-text mb-3">
                  Profile Management
                </h1>
                <hr />
                <form className="m-auto w-50 mt-3">
                  <div>
                    <label for="formFileLg" className="form-label">
                      Upload your resume <span className="text-danger">*</span>
                    </label>
                    <input
                      className="form-control form-control-lg"
                      id="fileInput"
                      type="file"
                      name="resume"
                      onChange={handleResume}
                      required
                    />
                    {resumePath && (
                      <input
                        className="form-control form-control-sm mt-2"
                        type="text"
                        value={resumePath}
                        readOnly
                      />
                    )}
                  </div>
                </form>
              </div>
              <div style={{ flex: 1 }}>
                <Survey model={survey} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Jobapplication;
