import React, { useState } from "react";

const TextComparisonPage = () => {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [similarityScore, setSimilarityScore] = useState(null);

  const handleTextComparison = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/text-similarity/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ extracted_text: text1, description: text2 }),
        }
      );

      const data = await response.json();
      setSimilarityScore(data.similarity_score);
    } catch (error) {
      console.error("Error comparing texts:", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={text1}
        onChange={(e) => setText1(e.target.value)}
      />
      <input
        type="text"
        value={text2}
        onChange={(e) => setText2(e.target.value)}
      />
      <button onClick={handleTextComparison}>Compare Texts</button>
      {similarityScore && <p>Similarity Score: {similarityScore}</p>}
    </div>
  );
};

export default TextComparisonPage;
