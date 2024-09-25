import React, { useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col } from "react-bootstrap";
import DashNavbar from "./DashNavbar";
import Sidebar from "./Sidebar";
import { useLocation } from "react-router-dom";
import letterheader from "../../Assets/letterheader.png";
import letterfooter from "../../Assets/letterfooter.png";
import html2pdf from "html2pdf.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const RejectionLetter = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const formData = location.state || {};
  const formatDate = (date) => {
    if (date) {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    }
    return "";
  };

  const rejectionLetterRef = useRef(null);

  const downloadAsPDF = async () => {
    const opt = {
      margin: 0.5,
      filename: `rejection_letter_${formData.candidateName}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    const pdfBlob = await html2pdf()
      .from(rejectionLetterRef.current)
      .set(opt)
      .output("blob");

    const formDataToSend = new FormData();
    formDataToSend.append(
      "pdf",
      pdfBlob,
      `${formData.candidateName}_Rejection_letter.pdf`
    );
    formDataToSend.append("candidateName", formData.candidateName);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/save_pdf/",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("PDF saved successfully:", response.data);
      Swal.fire({
        icon: "success",
        title: "Letter GeneratedSuccessfully",
        text: "For Download Redirecting to another page...",
        timer: 1000,
        timerProgressBar: true,
        showConfirmButton: false,
      }).then(() => {
        navigate("/letterform");
      });
    } catch (error) {
      console.error("Error saving PDF:", error);
      Swal.fire({
        icon: "error",
        title: "Error Saving PDF",
        text: "An error occurred while saving the PDF. Please try again later.",
        timer: 4000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <DashNavbar />
      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar />
        <div
          style={{
            backgroundColor: "#f0f0f0",
            padding: "20px",
            width: "100%",
            position: "relative",
          }}
        >
          <Container
            style={{
              backgroundColor: "#ffffff",
              padding: "40px",
              maxWidth: "595px",
              maxHeight: "842px",
            }}
            ref={rejectionLetterRef}
          >
            <Row>
              <Col>
                <img
                  src={letterheader}
                  style={{ maxWidth: "596px", margin: "-40px 0 0 -40px" }}
                />
                <h2 className="text-center">Rejection Letter </h2>
                <div className="text-end">{formatDate(formData.date)}</div>
                <p className="text-start">Dear {formData.candidateName},</p>
                <p>
                  We regret to inform you that we have decided not to proceed
                  with your application for the position of at this time.
                </p>
                <p>
                  We appreciate the time and effort you invested in the
                  application process and wish you the best of luck in your
                  future endeavors.
                </p>
                <p className="text-start">
                  Sincerely,
                  <br />
                  HR
                  <br />
                  The Data Tech Lab
                </p>
                <img
                  src={letterfooter}
                  style={{ maxWidth: "596px", margin: "270px 0 -42px -40px" }}
                />
              </Col>
            </Row>
          </Container>
          <div
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
            }}
          >
            <button onClick={downloadAsPDF}>Save PDF</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RejectionLetter;
