import React from "react";
import { Modal, Button, Row, Col, Card } from "react-bootstrap";

const ApplicantDetailsModal = ({ applicant, show, onHide }) => {
  const modalBodyStyle = {
    padding: "1%",
  };

  const cardHeaderStyle = {
    backgroundColor: "#f8f9fa",
    borderBottom: "1px solid #dee2e6",
  };
  const cardStyle = {
    marginBottom: "20px",
  };
  const cardBodyStyle = {
    padding: "15px",
    overflowY: "auto",
  };

  const sectionTitleStyle = {
    fontSize: "1.2rem",
    marginBottom: "10px",
    color: "#007bff",
  };

  return (
    <Modal show={show} onHide={onHide} dialogClassName="modal-xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>Applicant Data</Modal.Title>
      </Modal.Header>
      <Modal.Body style={modalBodyStyle}>
        <Row className="justify-content-center">
          <Col md={10}>
            <Card style={cardStyle}>
              <Card.Header style={cardHeaderStyle}>
                <h5 style={sectionTitleStyle}>Personal Information</h5>
              </Card.Header>
              <Card.Body style={cardBodyStyle}>
                <Row>
                  <Col md={6}>
                    <p>
                      <strong>First Name:</strong> {applicant.first_name}
                    </p>
                    <p>
                      <strong>Last Name:</strong> {applicant.last_name}
                    </p>
                    <p>
                      <strong>Email:</strong> {applicant.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {applicant.phone}
                    </p>
                    <p>
                      <strong>Birthdate:</strong> {applicant.birthdate}
                    </p>
                    <p>
                      <strong>Nationality:</strong> {applicant.nationality}
                    </p>
                  </Col>
                  <Col md={6}>
                    <p>
                      <strong>Address Type:</strong> {applicant.address_type}
                    </p>
                    <p>
                      <strong>Street Address:</strong>{" "}
                      {applicant.street_address}
                    </p>
                    <p>
                      <strong>City:</strong> {applicant.city}
                    </p>
                    <p>
                      <strong>Country:</strong> {applicant.country}
                    </p>
                    <p>
                      <strong>State:</strong> {applicant.state}
                    </p>
                    <p>
                      <strong>Zip Code:</strong> {applicant.zip_code}
                    </p>
                    <p>
                      <strong>Relocating:</strong> {applicant.relocating}
                    </p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Card style={cardStyle}>
              <Card.Header style={cardHeaderStyle}>
                <h5 style={sectionTitleStyle}>Educational Details</h5>
              </Card.Header>
              <Card.Body style={cardBodyStyle}>
                <Row>
                  <Col md={6}>
                    <p>
                      <strong>Degree:</strong> {applicant.degree}
                    </p>
                    <p>
                      <strong>Specify Degree:</strong>{" "}
                      {applicant.specify_degree}
                    </p>
                    <p>
                      <strong>College:</strong> {applicant.college}
                    </p>
                    <p>
                      <strong>Branch:</strong> {applicant.branch}
                    </p>
                    <p>
                      <strong>Skills:</strong> {applicant.skills}
                    </p>
                  </Col>
                  <Col md={6}>
                    <p>
                      <strong>Country of College:</strong>{" "}
                      {applicant.country_of_college}
                    </p>
                    <p>
                      <strong>City of College:</strong>{" "}
                      {applicant.city_of_college}
                    </p>
                    <p>
                      <strong>State of College:</strong>{" "}
                      {applicant.state_of_college}
                    </p>
                    <p>
                      <strong>Graduation Date:</strong>{" "}
                      {applicant.graduation_date}
                    </p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Card style={cardStyle}>
              <Card.Header style={cardHeaderStyle}>
                <h5 style={sectionTitleStyle}>Employment Details</h5>
              </Card.Header>
              <Card.Body style={cardBodyStyle}>
                <Row>
                  <p>
                    <strong>Employed with DataTech:</strong>{" "}
                    {applicant.employed_with_datetech}
                  </p>
                  <p>
                    <strong>Employee ID:</strong> {applicant.employee_id}
                  </p>
                  <p>
                    <strong>Employed with Government:</strong>{" "}
                    {applicant.employed_with_govt}
                  </p>
                  <p>
                    <strong>How did you hear about us:</strong>{" "}
                    {applicant.how_did_you_hear}
                  </p>
                  <p>
                    <strong>Specify how you heard:</strong>{" "}
                    {applicant.specify_hear}
                  </p>
                  <p>
                    <strong>Authorized to Work:</strong>{" "}
                    {applicant.authorized_to_work}
                  </p>
                  <p>
                    <strong>Require Visa Sponsorship:</strong>{" "}
                    {applicant.require_visa_sponsorship}
                  </p>
                  <p>
                    <strong>Employer:</strong> {applicant.employer}
                  </p>
                  <p>
                    <strong>Work City:</strong> {applicant.work_city}
                  </p>
                  <p>
                    <strong>Work Country:</strong> {applicant.work_country}
                  </p>
                  <p>
                    <strong>Work State:</strong> {applicant.work_state}
                  </p>
                  <p>
                    <strong>Job Title:</strong> {applicant.job_title}
                  </p>
                  <p>
                    <strong>Work Start Date:</strong>{" "}
                    {applicant.work_start_date}
                  </p>
                  <p>
                    <strong>Work End Date:</strong> {applicant.work_end_date}
                  </p>
                  <p>
                    <strong>Work Description:</strong>{" "}
                    {applicant.work_description}
                  </p>
                  <p>
                    <strong>Reason for Leaving:</strong>{" "}
                    {applicant.reason_for_leaving}
                  </p>
                  <p>
                    <strong>Current CTC:</strong> {applicant.current_ctc}
                  </p>
                  <p>
                    <strong>Total Experience Months:</strong>{" "}
                    {applicant.total_experience_months}
                  </p>
                  <p>
                    <strong>Current Notice Period Days:</strong>{" "}
                    {applicant.current_notice_period_days}
                  </p>
                  <p>
                    <strong>Timezone:</strong> {applicant.timezone}
                  </p>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ApplicantDetailsModal;
