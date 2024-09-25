import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function PasswordResetPage() {
  const { uidb64, token } = useParams();
  const [password, setPassword] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const apiUrl = "http://127.0.0.1:8000/update_password/";
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uidb64, token, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setResetMessage(data.message);
      } else {
        console.error("Failed to reset password");
      }
    } catch (error) {
      console.error("Error occurred while resetting password:", error);
    }
  };

  useEffect(() => {
    const validateResetLink = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/update_password/?uidb64=${uidb64}&token=${token}`
        );
        const data = await response.json();

        if (data.valid) {
          console.log("Reset link is valid");
        } else {
          console.error("Invalid reset link");
          // Optionally, you can redirect to an error page here
        }
      } catch (error) {
        console.error("Error validating reset link:", error);
      }
    };

    validateResetLink();
  }, [uidb64, token]);

  const handleLoginRedirect = () => {
    // Redirect to the login page
    navigate("/sign-in");
  };

  return (
    <div className="auth-inner mt-5">
      <form onSubmit={handleSubmit}>
        <h3>Reset Password</h3>
        <div className="mb-3 d-flex flex-column align-items-start">
          <label>Enter New Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <div className="d-grid">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
        {resetMessage && (
          <div className="mt-3 alert alert-success" role="alert">
            {resetMessage}
            <br />
            <span
              onClick={handleLoginRedirect}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={{
                textDecoration: isHovered ? "underline" : "none",
                color: isHovered ? "blue" : "inherit",
                cursor: "pointer",
              }}
            >
              Go to login page
            </span>
          </div>
        )}
      </form>
    </div>
  );
}

export default PasswordResetPage;
