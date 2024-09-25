import React, { useState, useEffect } from "react";
import axios from "axios";
import DashNavbar from "./Misc/DashNavbar";
import Sidebar from "./Misc/Sidebar";
import { GoArrowRight } from "react-icons/go";
import personality13 from "../Assets/personality13.png";
import "../index.css";
import Swal from "sweetalert2";

const PersonalityQuizForm = () => {
  const traitOrder = [
    "extraversion",
    "agreeableness",
    "openness",
    "conscientiousness",
    "neuroticism",
  ];

  const [answers, setAnswers] = useState({
    extraversion: Array.from({ length: 5 }, () => null),
    agreeableness: Array.from({ length: 5 }, () => null),
    openness: Array.from({ length: 5 }, () => null),
    conscientiousness: Array.from({ length: 5 }, () => null),
    neuroticism: Array.from({ length: 5 }, () => null),
  });

  const questions = {
    extraversion: [
      "I enjoy social gatherings and meeting new people.",
      "I prefer spending time alone rather than with a large group.",
      "I am outgoing and talkative.",
      "I am reserved and quiet.",
      "I enjoy being the center of attention.",
    ],
    agreeableness: [
      "I am generally compassionate and empathetic.",
      "I prioritize getting my work done over helping others.",
      "I avoid conflicts and arguments.",
      "I am willing to stand up for what I believe, even if it causes conflict.",
      "I am easygoing and forgiving.",
    ],
    openness: [
      "I am curious about the world and enjoy trying new things.",
      "I prefer routine and familiarity over novelty.",
      "I am imaginative and creative.",
      "I stick to traditional ways of doing things.",
      "I am open-minded and embrace new ideas.",
    ],
    conscientiousness: [
      "I am organized and like to have a plan for everything.",
      "I am spontaneous and go with the flow.",
      "I am focused on achieving my goals.",
      "I often procrastinate and leave things until the last minute.",
      "I pay attention to details and strive for perfection.",
    ],
    neuroticism: [
      "I am generally calm and emotionally stable.",
      "I tend to worry a lot about the future.",
      "I am easily stressed and anxious.",
      "I rarely feel sad or depressed.",
      "I am emotionally sensitive and easily get upset.",
    ],
  };

  const responseOptions = [
    "Strongly Disagree",
    "Disagree",
    "Neutral",
    "Agree",
    "Strongly Agree",
  ];

  const mapResponseToInt = (response) => {
    switch (response) {
      case "Strongly Disagree":
        return 1;
      case "Disagree":
        return 2;
      case "Neutral":
        return 3;
      case "Agree":
        return 4;
      case "Strongly Agree":
        return 5;
      default:
        return 3;
    }
  };

  const [quizStarted, setQuizStarted] = useState(false);
  const [quizTaken, setQuizTaken] = useState(false);

  useEffect(() => {
    const user_id_from_storage = localStorage.getItem("user_id");
    const checkQuizStatus = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/check_quiz_status/${user_id_from_storage}/`
        );

        if ("quiz_taken" in response.data) {
          setQuizTaken(response.data.quiz_taken);
        }
      } catch (error) {
        console.error("Error checking quiz status:", error.message);
      }
    };

    if (user_id_from_storage) {
      checkQuizStatus();
    }
  }, []);

  const handleStartQuiz = () => {
    if (quizTaken) {
      Swal.fire({
        icon: "info",
        title: "Quiz Already Taken",
        text: "You have already completed the quiz.",
      });
    } else {
      setQuizStarted(true);
    }
  };

  const handleResponseChange = (trait, index, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [trait]: prevAnswers[trait].map((prevValue, i) =>
        i === index ? value : prevValue
      ),
    }));
  };
  const areAllQuestionsAnswered = () => {
    for (const trait of traitOrder) {
      for (const answer of answers[trait]) {
        if (
          answer === null ||
          answer === undefined ||
          answer === "" ||
          answer === 0
        ) {
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const user_id_from_storage = localStorage.getItem("user_id");
      if (!user_id_from_storage) {
        console.error("User ID not found in local storage.");
        return;
      }

      if (!areAllQuestionsAnswered()) {
        Swal.fire({
          icon: "warning",
          title: "Incomplete Quiz",
          text: "Please answer all questions before submitting the quiz.",
        });
        return;
      }

      const formattedAnswers = {};
      traitOrder.forEach((trait) => {
        formattedAnswers[trait] = answers[trait].map((response) =>
          mapResponseToInt(response)
        );
      });

      const csrfToken = getCookie("csrftoken");
      const response = await axios.post(
        "http://127.0.0.1:8000/save_personality_result/",
        { user_id: user_id_from_storage, answers: formattedAnswers },
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
        }
      );

      if ("message" in response.data) {
        await Swal.fire({
          icon: "success",
          title: "Quiz Submitted Successfully!",
          text: "Thank you for completing the personality assessment.",
        });
        window.location.reload();
      }
    } catch (error) {
      console.error("Error:", error.message);
      Swal.fire({
        icon: "error",
        title: "Quiz Submission Failed",
        text: "An error occurred while submitting the quiz. Please try again.",
      });
    }
  };

  function getButtonClass(response) {
    switch (response) {
      case "Strongly Agree":
        return "btn-dark-green";
      case "Agree":
        return "btn-faint-green";
      case "Disagree":
        return "btn-faint-violet";
      case "Strongly Disagree":
        return "btn-dark-violet";
      default:
        return "btn-ashgray";
    }
  }

  function getCookie(name) {
    const cookieValue = document.cookie.match(
      "(^|;)\\s*" + name + "\\s*=\\s*([^;]+)"
    );
    return cookieValue ? cookieValue.pop() : null;
  }

  return (
    <div>
      <div
        style={{ display: "flex", flexDirection: "column", height: "100vh" }}
      >
        <DashNavbar />
        <div style={{ display: "flex", flex: 1 }}>
          {" "}
          <Sidebar />
          <div
            className="container  personality"
            style={{
              backgroundColor: "#ffffff",
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            {quizStarted ? (
              <>
                <div
                  className="container auth-inner w-100 "
                  style={{
                    backgroundColor: "#ffffff",
                    padding: "20px",
                    borderRadius: "8px",
                  }}
                >
                  <h2 class="display-6  gradient-text mb-3">
                    Personality Assessment
                  </h2>

                  <div className="mb-1 row">
                    <div className="col-md-12">
                      {traitOrder.map((trait) => (
                        <div key={trait}>
                          {answers[trait].map((answer, index) => (
                            <div key={index} className="mb-3 text-start">
                              <p className="h5">
                                <hr />
                                {`Question ${
                                  index + 1 + traitOrder.indexOf(trait) * 5
                                }: ${questions[trait][index]}`}
                              </p>
                              <div className="d-flex align-items-start personality2">
                                {responseOptions.map((option, optionIndex) => (
                                  <div
                                    key={optionIndex}
                                    className="d-flex align-items-start mb-2"
                                  >
                                    <label
                                      className={`btn ${
                                        answers[trait][index] === option
                                          ? getButtonClass(option)
                                          : "btn-outline-none"
                                      }`}
                                      style={{ margin: "25px 30px 25px 25px" }}
                                    >
                                      <input
                                        type="radio"
                                        style={{ display: "none" }}
                                        value={option}
                                        checked={
                                          answers[trait][index] === option
                                        }
                                        onChange={() =>
                                          handleResponseChange(
                                            trait,
                                            index,
                                            option
                                          )
                                        }
                                      />
                                      {option}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                  <footer className="footer py-3 bg-light">
                    <div className="container">
                      <button
                        className="btn btn-success btn-lg fw-bold"
                        onClick={handleSubmit}
                      >
                        Submit Quiz
                      </button>
                    </div>
                  </footer>
                </div>
              </>
            ) : (
              <>
                <div className="container text-center mb-5">
                  <img
                    src={personality13}
                    alt="Admin"
                    className="imgpersonality"
                  />
                  <h1 className="display-4 fw-bold gradient-text mb-3">
                    Personality Assessment
                  </h1>
                  <p className="lead mt-4">
                    Personality assessments are tools designed to measure and
                    evaluate various aspects of an individual's personality.
                    These assessments aim to provide insights into an
                    individual's traits, preferences, behaviour patterns, and
                    emotional tendencies.
                  </p>
                  <h2 className="text-dark mt-5 mb-5 ">
                    Ready to start the quiz?
                  </h2>
                </div>

                <footer className="footer py-3 bg-light mt-5">
                  <div className="container ">
                    <div className="row">
                      <div className="col-6">
                        <p className="">
                          The Personality Assessment | 25 Questions
                        </p>
                      </div>
                      <div className="col-6 text-end">
                        <button
                          className={`btn btn-primary fw-bold ${
                            quizTaken ? "disabled" : ""
                          }`}
                          onClick={handleStartQuiz}
                          disabled={quizTaken}
                        >
                          {quizTaken ? "Quiz Already Taken" : "Start Quiz"}{" "}
                          <GoArrowRight />
                        </button>
                      </div>
                    </div>
                  </div>
                </footer>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalityQuizForm;
