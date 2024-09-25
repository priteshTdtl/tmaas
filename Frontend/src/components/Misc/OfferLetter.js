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
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const OfferLetter = () => {
  const location = useLocation();
  const navigate = useNavigate();
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

  const offerLetterRef = useRef(null);

  const downloadAsPDF = async () => {
    const opt = {
      margin: 0.5,
      filename: "offer_letter.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    const pdfBlob = await html2pdf()
      .from(offerLetterRef.current)
      .set(opt)
      .output("blob");

    const formDataToSend = new FormData();
    formDataToSend.append(
      "pdf",
      pdfBlob,
      `${formData.candidateName}_offer_letter.pdf`
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
            marginTop: "3em",
          }}
        >
          <Container
            style={{
              backgroundColor: "#ffffff",
              padding: "40px",
              maxWidth: "595px",
              maxHeight: "842px",
            }}
            ref={offerLetterRef}
          >
            <Row>
              <Col>
                <img
                  src={letterheader}
                  style={{ maxWidth: "596px", margin: "-40px 0 0 -40px" }}
                />
                <h2 className="text-center">Offer Letter </h2>
                <div className="text-end">{formatDate(formData.date)}</div>
                <p className="text-start">Dear {formData.candidateName},</p>
                <p className="text-start">
                  We are pleased to offer you the position of{" "}
                  <strong> {formData.position} </strong> at{" "}
                  <strong> The Data Tech Lab </strong>. We were impressed with
                  your qualifications and believe that you will be a valuable
                  asset to our team.
                </p>
                <p className="text-start">Details of your employment offer:</p>
                <ul className="text-start">
                  <li>Position: {formData.position}</li>
                  <li>CTC: {formData.salary}</li>
                </ul>
                <p>
                  Please review this offer letter carefully. If you accept this
                  offer, please sign and return a copy to us by Date.
                </p>
                <p>
                  If you have any questions or need further clarification,
                  please don't hesitate to contact us.
                </p>
                <p>We look forward to welcoming you to the team!</p>
                <p className="text-start">
                  Sincerely,
                  <br />
                  HR
                  <br />
                  The Data Tech Lab
                </p>
                <img
                  src={letterfooter}
                  style={{ maxWidth: "596px", margin: "0 0 -42px -40px" }}
                />
              </Col>
            </Row>
          </Container>
          <div
            style={{
              position: "absolute",
              top: "79px",
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

export default OfferLetter;
