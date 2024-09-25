import React, { Component } from "react";
import "../css/dash.css";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";

export default class Home extends Component {
  render() {
    return (
      <>
        <Navbar />
        <div className="content">
          <h1>Welcome to TMaaS</h1>
          <p className="lead">Made by The Data Tech Labs</p>
          <Link className="btn btn-outline-dark" to="/sign-up">
            Start Here!
          </Link>
        </div>
      </>
    );
  }
}
