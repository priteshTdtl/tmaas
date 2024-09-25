import React, { useState } from "react";

const Showpdf = () => {
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("pdf_file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/extract-pdf-text/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const combinedText = data.extracted_text.join("\n");
      setExtractedText(combinedText);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      <button onClick={handleUpload}>Submit PDF</button>

      {extractedText && (
        <div>
          <h3>Extracted Text:</h3>
          <div className="for-auth-inner">
            <pre>{extractedText}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default Showpdf;
