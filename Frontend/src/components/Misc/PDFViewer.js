import React, { useState } from "react";
import DashNavbar from "./DashNavbar";
import "../css/dash.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/PDFViewer.css";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import Sidebar from "./Sidebar";

export default function PDFViewer() {
  const [pdfFile, setPDFFile] = useState(null);
  const [viewPdf, setViewPdf] = useState(null);

  const handleChange = (e) => {
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === "application/pdf") {
        let reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onload = (e) => {
          setPDFFile(e.target.result);
        };
      } else {
        setPDFFile(null);
      }
    } else {
      console.log("Please select a file");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pdfFile !== null) {
      setViewPdf(pdfFile);
    } else {
      setViewPdf(null);
    }
  };

  const newplugin = defaultLayoutPlugin();

  return (
    <>
      <div
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <DashNavbar />
        <div style={{ display: "flex", flex: 1 }}>
          <Sidebar />
          <div
            className="container pt-5  mt-sm-5 mt-md-5 mt-lg-4 mt-xl-5 ml-5"
            style={{ width: "50%", marginTop: "20vh" }}
          >
            <form
              onSubmit={handleSubmit}
              className=" ms-lg-5 ps-lg-5  ms-md-5 ps-md-5"
            >
              <input
                type="file"
                className="form-control w-100 mb-3"
                onChange={handleChange}
              />
              <button type="submit" className="btn btn-outline-dark w-100 mb-3">
                View Pdf
              </button>
              <div style={{ width: "100%" }}>
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                  {viewPdf ? (
                    <Viewer
                      fileUrl={viewPdf}
                      workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js"
                      plugins={[newplugin]}
                    />
                  ) : (
                    <div>No PDF</div>
                  )}
                </Worker>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
