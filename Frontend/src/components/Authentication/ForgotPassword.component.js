import React, { Component } from "react";
import Navbar from "../Misc/Navbar";

export default class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      loading: false,
      resetMessage: "",
    };
  }

  handleEmailChange = (e) => {
    this.setState({ email: e.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    // Perform validation if needed

    // Display loading state while waiting for the API response
    this.setState({ loading: true, resetMessage: "" });

    try {
      const apiUrl = "http://127.0.0.1:8000/forgot_password/";
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: this.state.email }),
      });

      if (response.ok) {
        this.setState({ resetMessage: "Reset code sent successfully!" });
      } else {
        console.error("Failed to send reset code");
      }
    } catch (error) {
      console.error("Error occurred while sending reset code:", error);
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    return (
      <>
        <Navbar />
        <div className="auth-inner mt-5">
          <form onSubmit={this.handleSubmit}>
            <h3>Forgot Password</h3>

            <div className="mb-3 d-flex flex-column align-items-start">
              <label>Email address</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                value={this.state.email}
                onChange={this.handleEmailChange}
              />
            </div>
            <div className="d-grid">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={this.state.loading}
              >
                {this.state.loading ? "Sending..." : "Send Reset Code"}
              </button>
            </div>
            {this.state.resetMessage && (
              <div className="mt-3 alert alert-success" role="alert">
                {this.state.resetMessage}
              </div>
            )}
          </form>
        </div>
      </>
    );
  }
}
