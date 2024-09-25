import axios from "axios";
import React, { Component, useState, useEffect } from "react";
import DashNavbar from "./DashNavbar";
import Sidebar from "./Sidebar";
import "../css/admindash.css";
import DataTable from "react-data-table-component";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
} from "chart.js";
import CanvasJSReact from "@canvasjs/react-charts";
import { FiUsers } from "react-icons/fi";
import { ImUserTie } from "react-icons/im";
import { AiOutlineSchedule } from "react-icons/ai";
import { MdWork } from "react-icons/md";
import { HiMiniUserGroup } from "react-icons/hi2";
import { FaUserCheck, FaUserTie } from "react-icons/fa";
import { FaChalkboardUser, FaUserXmark } from "react-icons/fa6";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { SlCalender } from "react-icons/sl";
import { ImSearch } from "react-icons/im";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale);
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const UserLineChart = () => {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/student");
        const data = response.data;

        // Group the data by date and count the number of users
        const groupedData = data.reduce((acc, curr) => {
          const date = curr.created_at.split("T")[0];
          if (acc[date]) {
            acc[date].count += 1;
          } else {
            acc[date] = { date, count: 1 };
          }
          return acc;
        }, {});

        // Convert the grouped data to an array
        const chartData = Object.values(groupedData);

        setUserData(chartData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  const chartData = {
    labels: userData.map((data) => data.date),
    datasets: [
      {
        label: "Number of Users",
        data: userData.map((data) => data.count),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(0, 0, 0, 0)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
        pointBorderColor: "rgba(75, 192, 192, 1)",
        pointHoverBackgroundColor: "rgba(75, 192, 192, 1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        tension: 0.4, // Adjust tension for smoother curves
      },
    ],
  };

  return (
    <div>
      <Line
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "Number of Users Over Time",
              font: {
                size: 25, // Increase font size for title
              },
            },
            tooltip: {
              mode: "index",
              intersect: false,
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              titleFont: { size: 16 },
              bodyFont: { size: 14 },
            },
          },
          scales: {
            x: {
              grid: {
                display: true,
                color: "rgba(0, 0, 0, 0.1)", // Adjust grid line color
              },
              ticks: {
                font: { size: 14 },
              },
            },
            y: {
              grid: {
                display: true,
                color: "rgba(0, 0, 0, 0.1)",
              },
              ticks: {
                font: { size: 14 },
              },
            },
          },
          animation: {
            duration: 1500, // Adjust animation duration
          },
        }}
      />
    </div>
  );
};

class AdminDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterDate: "", // Initialize filter for date
      filterName: "",
      totalusers: 0,
      activeUsersCount: 0,
      inactiveUsersCount: 0,
      totalApplicants: 0,
      totalInterviews: 0,
      totalJobOpenings: 0,
      appliedCount: 0,
      underReviewCount: 0,
      interviewScheduledCount: 0,
      selectedCount: 0,
      rejectedCount: 0,
      interviewercount: 0,
      hrcount: 0,
      candidatecount: 0,
      admincount: 0,
      monthlyUserCounts: [],
      filterDate: "", // Initialize filter for date
      filterName: "",
      user_list: [],
      applicant_list: [],
      jobopening_list: [],
      interview_scheduled_list: [],
      Hr_list: [],
      Interviewer_list: [],
      date: [],
      showDateInput: false,
      showNameInput: false,
      filterDate1: "", // Initialize filter for date
      showDateInput1: false,
      filterDate2: "", // Initialize filter for date
      filterName2: "",
      showDateInput2: false,
      showNameInput2: false,
      pageCount: 0, // Initialize page count
      userCurrentPage: 1,
      userItemsPerPage: 3,
      interviewCurrentPage: 1,
      interviewItemsPerPage: 3,
      jobOpeningCurrentPage: 1,
      jobOpeningItemsPerPage: 3,
      startDate: null,
      endDate: null,
      startDate2: null,
      endDate2: null,
      Personality_score: [],
    };
    this.traitOptions = [
      { value: "neuroticism", label: "Neuroticism" },
      { value: "conscientiousness", label: "Conscientiousness" },
      { value: "openness", label: "Openness" },
      { value: "extraversion", label: "Extraversion" },
      { value: "agreeableness", label: "Agreeableness" },
    ];
    this.selectedTrait = "";
  }
  componentDidMount() {
    this.fetchTotalApplicants();
    this.fetchTotalInterviews();
    this.fetchTotalJobOpenings();
    this.fetchJobApplicationStatusCounts();
    this.fetchTotalUsers();
    this.fetchTotalAccountStatus();
    this.fetchrolecount();
    this.userline();
    this.fetchUserList();
    this.applicantList();
    this.jobopeninglist();
    this.interview_scheduled_list();
    this.Hr_list();
    this.Interviewer_list();
    this.Personality_score();
  }

  Personality_score = () => {
    axios
      .get("http://127.0.0.1:8000/personality_list/")
      .then((response) => {
        const Personality_score = response.data;
        const filteredData = Personality_score.filter((item) => {
          return (
            item.max_personality.includes("neuroticism") ||
            item.max_personality.includes("conscientiousness") ||
            item.max_personality.includes("openness") ||
            item.max_personality.includes("extraversion") ||
            item.max_personality.includes("agreeableness")
          );
        });
        this.setState({ Personality_score, filteredData });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  Interviewer_list() {
    axios
      .get("http://127.0.0.1:8000/Interviewer_list/")
      .then((response) => {
        const Interviewer_list = response.data;
        this.setState({ Interviewer_list });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  Hr_list() {
    axios
      .get("http://127.0.0.1:8000/HR_list/")
      .then((response) => {
        const Hr_list = response.data;
        this.setState({ Hr_list });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  interview_scheduled_list() {
    axios
      .get("http://127.0.0.1:8000/get_interview_list/")
      .then((response) => {
        const interview_scheduled_list = response.data;
        this.setState({ interview_scheduled_list });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  fetchUserList() {
    axios
      .get("http://127.0.0.1:8000/list_users/")
      .then((response) => {
        const user_list = response.data;
        this.setState({ user_list });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  applicantList() {
    axios
      .get("http://127.0.0.1:8000/get_applicant_names/")
      .then((response) => {
        const applicant_list = response.data;
        this.setState({ applicant_list });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  jobopeninglist() {
    axios
      .get("http://127.0.0.1:8000/job_opening_list/")
      .then((response) => {
        const jobopening_list = response.data;
        this.setState({ jobopening_list });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }
  userline() {
    // Fetch monthly user counts from backend API
    axios
      .get("http://127.0.0.1:8000/get_user_count_data/")
      .then((response) => {
        const monthlyUserCounts = response.data.user_counts;
        this.setState({ monthlyUserCounts });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  getMonthName = (month) => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return monthNames[month - 1];
  };

  fetchJobApplicationStatusCounts() {
    fetch("http://127.0.0.1:8000/job_application_status_counts/")
      .then((response) => response.json())
      .then((data) => {
        const {
          Applied,
          under_review,
          interview_scheduled,
          selected,
          rejected,
        } = data.status_counts;
        this.setState({
          appliedCount: Applied || 0,
          underReviewCount: under_review || 0,
          interviewScheduledCount: interview_scheduled || 0,
          selectedCount: selected || 0,
          rejectedCount: rejected || 0,
        });
      })
      .catch((error) => {
        console.error("Error fetching job application status counts:", error);
      });
  }

  fetchrolecount() {
    fetch("http://127.0.0.1:8000/get_role_count/")
      .then((response) => response.json())
      .then((data) => {
        const { Candidate, Interviewer, HR, Admin } = data.status_counts;
        this.setState({
          candidatecount: Candidate,
          interviewercount: Interviewer || 0,
          hrcount: HR || 0,
          admincount: Admin || 0,
        });
      })
      .catch((error) => {
        console.error("Error fetching job application status counts:", error);
      });
  }

  fetchTotalJobOpenings() {
    fetch("http://127.0.0.1:8000/total_job_openings/")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ totalJobOpenings: data.total_job_openings });
      })
      .catch((error) => {
        console.error("Error fetching total job openings:", error);
      });
  }

  fetchTotalApplicants() {
    fetch("http://127.0.0.1:8000/total_applicants/")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ totalApplicants: data.total_applicants });
      })
      .catch((error) => {
        console.error("Error fetching total applicants:", error);
      });
  }

  fetchTotalInterviews() {
    fetch("http://127.0.0.1:8000/interviews/")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ totalInterviews: data.length });
      })
      .catch((error) => {
        console.error("Error fetching total interviews:", error);
      });
  }

  fetchTotalUsers() {
    fetch("http://127.0.0.1:8000/total_users/")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ totalusers: data.total_users });
      })
      .catch((error) => {
        console.error("Error fetching total Users:", error);
      });
  }

  fetchTotalAccountStatus() {
    fetch("http://127.0.0.1:8000/total_account_status/")
      .then((response) => response.json())
      .then((data) => {
        const { active_users, inactive_users } = data;
        this.setState({
          activeUsersCount: active_users,
          inactiveUsersCount: inactive_users,
        });
      })
      .catch((error) => {
        console.error("Error fetching total Users:", error);
      });
  }
  filterByDate = () => {
    const { user_list, startDate, endDate } = this.state;
    return user_list.filter((user) => {
      const createdAt = moment(user.created_at, "DD/MM/YYYY");
      if (startDate && endDate) {
        return createdAt.isBetween(startDate, endDate, null, "[]");
      } else if (startDate) {
        return createdAt.isSameOrAfter(startDate, "day");
      } else if (endDate) {
        return createdAt.isSameOrBefore(endDate, "day");
      }
      return true;
    });
  };
  handleStartDateChange = (date) => {
    this.setState({ startDate: date });
  };

  handleEndDateChange = (date) => {
    this.setState({ endDate: date });
  };

  // Function to filter users based on name
  filterByName = () => {
    const { user_list, filterName } = this.state;
    return user_list.filter((user) =>
      user.name.toLowerCase().includes(filterName.toLowerCase())
    );
  };

  // Function to handle change in date filter input
  handleDateChange = (e) => {
    this.setState({ filterDate: e.target.value });
  };

  // Function to handle change in name filter input
  handleNameChange = (e) => {
    this.setState({ filterName: e.target.value });
  };

  handleButtonClick = () => {
    this.setState({ showInput: true });
  };

  // Function to toggle visibility of date input
  toggleDateInput = () => {
    this.setState((prevState) => ({
      showDateInput: !prevState.showDateInput,
    }));
  };

  // Function to toggle visibility of name input
  toggleNameInput = () => {
    this.setState((prevState) => ({
      showNameInput: !prevState.showNameInput,
    }));
  };

  filterByDate1 = () => {
    const { interview_scheduled_list, filterDate1 } = this.state;
    return interview_scheduled_list.filter((interview) =>
      interview.date.includes(filterDate1)
    );
  };

  handleDateChange1 = (e) => {
    this.setState({ filterDate1: e.target.value });
  };

  toggleDateInput1 = () => {
    this.setState((prevState) => ({
      showDateInput1: !prevState.showDateInput1,
    }));
  };

  filterByDate2 = () => {
    const { jobopening_list, startDate2, endDate2 } = this.state;
    return jobopening_list.filter((user) => {
      const createdAt = moment(user.created_at, "DD/MM/YYYY");
      if (startDate2 && endDate2) {
        return createdAt.isBetween(startDate2, endDate2, null, "[]");
      } else if (startDate2) {
        return createdAt.isSameOrAfter(startDate2, "day");
      } else if (endDate2) {
        return createdAt.isSameOrBefore(endDate2, "day");
      }
      return true;
    });
  };
  handleStartDateChange2 = (date) => {
    this.setState({ startDate2: date });
  };

  handleEndDateChange2 = (date) => {
    this.setState({ endDate2: date });
  };

  filterByName2 = () => {
    const { jobopening_list, filterName2 } = this.state;
    return jobopening_list.filter((user) =>
      user.jobtitle.toLowerCase().includes(filterName2.toLowerCase())
    );
  };

  handleDateChange2 = (e) => {
    this.setState({ filterDate2: e.target.value });
  };

  // Function to handle change in name filter input
  handleNameChange2 = (e) => {
    this.setState({ filterName2: e.target.value });
  };

  toggleDateInput2 = () => {
    this.setState((prevState) => ({
      showDateInput2: !prevState.showDateInput2,
    }));
  };

  toggleNameInput2 = () => {
    this.setState((prevState) => ({
      showNameInput2: !prevState.showNameInput2,
    }));
  };

  handleTraitChange = (event) => {
    this.selectedTrait = event.target.value;
    const filteredData = this.state.Personality_score.filter((item) => {
      return item.max_personality.includes(this.selectedTrait);
    });
    this.setState({ filteredData });
  };

  // componentDidMount() {
  //   // Fetch interview data and set state
  //   this.interview_scheduled_list();
  // }
  loadPage(pageNumber) {
    const { perPage } = this.state;
    const offset = pageNumber * perPage;
    const filteredData = this.state.user_list.slice(offset, offset + perPage);
    console.log("Filtered data for page", pageNumber, ":", filteredData);
    this.setState({ currentPage: pageNumber, filteredUsers: filteredData });
  }

  handlePageClick = (data) => {
    const selectedPage = data.selected;
    this.loadPage(selectedPage);
  };

  handleUserPageChange = (page) => {
    this.setState({ userCurrentPage: page });
  };

  handleInterviewPageChange = (page) => {
    this.setState({ interviewCurrentPage: page });
  };

  handleJobOpeningPageChange = (page) => {
    this.setState({ jobOpeningCurrentPage: page });
  };

  // Function to handle the deletion of a job opening
  deleteJobOpening(jobId) {
    axios
      .delete(`http://127.0.0.1:8000/job_opening/${jobId}/`)
      .then((response) => {
        // Update the state to remove the deleted job
        this.setState((prevState) => ({
          jobopening_list: prevState.jobopening_list.filter(
            (job) => job.job_id !== jobId
          ),
        }));
        // Provide feedback to the user
        alert("Job opening deleted successfully!");
        console.log("Job opening deleted:", response.data);
      })
      .catch((error) => {
        // Handle any errors here
        console.error("Error deleting job opening:", error);
        // Provide error feedback to the user
        alert("Failed to delete job opening. Please try again.");
      });
  }

  render() {
    const { filterDate, filterName, showDateInput, showNameInput, user_list } =
      this.state;
    const { filterDate1, showDateInput1 } = this.state;
    const { filterDate2, showDateInput2, filterName2, showNameInput2 } =
      this.state;
    const { endDate, startDate } = this.state;
    const { endDate2, startDate2 } = this.state;
    const filteredJobOpenings = this.filterByDate2().filter((user) =>
      this.filterByName2().includes(user)
    );
    const filteredInterviews = this.filterByDate1();
    // Apply filters and get filtered users
    const filteredUsers = this.filterByDate().filter((user) =>
      this.filterByName().includes(user)
    );
    const { userCurrentPage, userItemsPerPage } = this.state;
    const { interviewCurrentPage, interviewItemsPerPage } = this.state;
    const { jobOpeningCurrentPage, jobOpeningItemsPerPage } = this.state;

    const userIndexOfLastItem = userCurrentPage * userItemsPerPage;
    const userIndexOfFirstItem = userIndexOfLastItem - userItemsPerPage;
    const currentUserItems = filteredUsers.slice(
      userIndexOfFirstItem,
      userIndexOfLastItem
    );

    const interviewIndexOfLastItem =
      interviewCurrentPage * interviewItemsPerPage;
    const interviewIndexOfFirstItem =
      interviewIndexOfLastItem - interviewItemsPerPage;
    const currentInterviewItems = filteredInterviews.slice(
      interviewIndexOfFirstItem,
      interviewIndexOfLastItem
    );

    const jobOpeningIndexOfLastItem =
      jobOpeningCurrentPage * jobOpeningItemsPerPage;
    const jobOpeningIndexOfFirstItem =
      jobOpeningIndexOfLastItem - jobOpeningItemsPerPage;
    const currentJobOpeningItems = filteredJobOpenings.slice(
      jobOpeningIndexOfFirstItem,
      jobOpeningIndexOfLastItem
    );

    const {
      totalusers,
      totalApplicants,
      totalInterviews,
      totalJobOpenings,
      appliedCount,
      underReviewCount,
      interviewScheduledCount,
      selectedCount,
      rejectedCount,
      hrcount,
      candidatecount,
      interviewercount,
      admincount,
      activeUsersCount,
      inactiveUsersCount,
    } = this.state;
    const pieChartData = [
      { name: "Under Review", value: underReviewCount },
      { name: "Selected", value: selectedCount },
      { name: "Rejected", value: rejectedCount },
      { name: "Interview Scheduled", value: interviewScheduledCount },
      { name: "Applied", value: appliedCount },
    ];

    const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"];
    const options = {
      animationEnabled: true,
      // exportEnabled: true,
      backgroundColor: "#ffffff",
      data: [
        {
          // color:  COLORS,
          type: "doughnut",
          showInLegend: true,
          // indexLabel: "{name}: {y}",
          // yValueFormatString: "#,###",
          dataPoints: [
            { color: "#9966FF", name: "Applied", y: appliedCount },
            { color: "#3399CC", name: "Selected", y: selectedCount },
            { color: "#FFCC66", name: "Rejected", y: rejectedCount },
            { color: "#ff6384", name: "Under Review", y: underReviewCount },
            {
              color: "#4bc0c0",
              name: "Interview Scheduled",
              y: interviewScheduledCount,
            },
          ],
        },
      ],
    };

    const { monthlyUserCounts } = this.state;
    // Create an array to hold user counts for each month (initialize with zeros)
    let monthCounts = Array.from({ length: 12 }, () => 0);

    // Populate monthCounts with actual user counts where available
    monthlyUserCounts.forEach((entry) => {
      const monthIndex = entry.month - 1; // Convert month number to zero-based index
      monthCounts[monthIndex] = entry.count;
    });
    // Function to get month name from month number
    const getMonthName = (month) => {
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      return months[month];
    };

    const dataPoints = monthCounts.map((count, index) => ({
      label: getMonthName(index),
      y: count,
    }));

    const data = {
      animationEnabled: true,
      interactivityEnabled: true,
      responsive: true,
      height: 300,
      backgroundColor: "#ffffff",
      // backgroundColor: "rgb(0,0,0,0.0)",      //opacity background
      axisX: {
        title: "Months",
        valueFormatString: "MMM",
        interval: 1,
      },
      axisY: {
        title: "User Count",
      },
      data: [
        {
          lineColor: " #321fdb",
          type: "spline",
          dataPoints: dataPoints,
        },
      ],
      animation: {
        duration: 2000,
      },
    };

    const columns = [
      {
        name: (
          <h6>
            <b>Name</b>
          </h6>
        ),
        selector: "name",
        format: (row) => row.name,
        // sortable: true,
      },
      {
        name: (
          <h6>
            <b>Date</b>
          </h6>
        ),
        selector: "created_at",
        format: (row) => row.created_at.slice(0, 10),
        // sortable: true,
      },
      {
        name: (
          <h6>
            <b>Profile Completed</b>
          </h6>
        ),
        selector: "status",
        format: (row) => row.status,
        // sortable: true,
      },
    ];

    const columns_job = [
      {
        name: (
          <h6>
            <b>Job ID</b>
          </h6>
        ),
        selector: "job_id",
        format: (row) => row.job_id,
      },
      {
        name: (
          <h6>
            <b>Date</b>
          </h6>
        ),
        selector: "created_at",
        format: (row) => row.created_at.slice(0, 10),
      },
      {
        name: (
          <h6>
            <b>Job Title</b>
          </h6>
        ),
        selector: "jobtitle",
        format: (row) => row.jobtitle,
      },
      {
        name: (
          <h6>
            <b>Action</b>
          </h6>
        ),
        cell: (row) => (
          <button
            className="btn btn-danger"
            onClick={() => this.deleteJobOpening(row.job_id)}
          >
            <i className="fa-solid fa-trash" />
          </button>
        ),
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
      },
    ];

    const columns_personality = [
      {
        name: (
          <h6>
            <b>Applicant Name</b>
          </h6>
        ),
        selector: "name",
        format: (item) => item.name,
        // sortable: true,
      },
      {
        name: (
          <h6>
            <b>Personality Test Result</b>
          </h6>
        ),
        selector: "created_at",
        format: (item) => item.max_personality.join(", "),
        // sortable: true,
      },
    ];

    const paginatedUsers = currentUserItems.slice(
      (userCurrentPage - 1) * userItemsPerPage,
      userCurrentPage * userItemsPerPage
    );
    return (
      <>
        {/* <div
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "50vh",
          }}
        > */}
        <DashNavbar />
        <div style={{ display: "flex", flex: 1, overflowX: "auto" }}>
          <Sidebar />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              // marginLeft: "2rem",
              minWidth: 0,
            }}
            className="dashboard mt-sm-5 ml-md-5  "
          >
            <div
            // style={{
            //   display: "flex",
            //   flexDirection: "row",
            //   flexWrap: "wrap",
            // }}
            >
              <div
                className="mt-3 "
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                }}
              >
                <div className="card-body admin ab admincardhover mb-1">
                  <h5 className="card-title headline">Total Users</h5>
                  <div
                    style={{ backgroundColor: "#0000", marginLeft: "180px" }}
                  >
                    <FiUsers style={{ color: "#ffffff", fontSize: "2em" }} />
                  </div>
                  <p className="card-text score display-5">{totalusers}</p>
                  {/* <UserLineChart className='linechart' />                    */}
                </div>

                <div className="card-body admin ab admincardhover mb-1">
                  <h5 className="card-title headline">Total Applicants</h5>
                  <div
                    style={{ backgroundColor: "#0000", marginLeft: "180px" }}
                  >
                    <ImUserTie style={{ color: "#ffffff", fontSize: "2em" }} />
                  </div>
                  <p className="card-text score display-5">{totalApplicants}</p>
                </div>

                <div className="card-body admin ab admincardhover mb-1">
                  <h5 className="card-title headline">
                    Total Interviews Scheduled
                  </h5>
                  <div
                    style={{ backgroundColor: "#0000", marginLeft: "180px" }}
                  >
                    <AiOutlineSchedule
                      style={{ color: "#ffffff", fontSize: "2em" }}
                    />
                  </div>
                  <p className="card-text score display-5">{totalInterviews}</p>
                </div>

                <div className="card-body admin ab admincardhover mb-1">
                  <h5 className="card-title headline">Total Job Openings</h5>
                  <div
                    style={{ backgroundColor: "#0000", marginLeft: "180px" }}
                  >
                    <MdWork style={{ color: "#ffffff", fontSize: "2em" }} />
                  </div>
                  <p className="card-text score display-3">
                    {totalJobOpenings}
                  </p>
                </div>
              </div>

              <div
                className="mt-3"
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  flexDirection: "row",
                  marginRight: "3rem",
                  // marginTop: "4rem",
                }}
              >
                <div className="card-body  hr  admincardhover mb-1">
                  <h5 className="card-title headline">Total No. of HR</h5>
                  <div
                    style={{ backgroundColor: "#0000", marginLeft: "180px" }}
                  >
                    <FaChalkboardUser
                      style={{ color: "#ffffff", fontSize: "2em" }}
                    />
                  </div>
                  <p className="card-text score display-5">{hrcount}</p>
                </div>

                <div className="card-body hr admincardhover mb-1">
                  <h5 className="card-title headline">Total Interviewers</h5>
                  <div
                    style={{ backgroundColor: "#0000", marginLeft: "180px" }}
                  >
                    <FaUserTie style={{ color: "#ffffff", fontSize: "2em" }} />
                  </div>
                  <p className="card-text score display-5">
                    {interviewercount}
                  </p>
                </div>

                <div className="card-body hr admincardhover mb-1">
                  <h5 className="card-title headline">Total Candidates</h5>
                  <div
                    style={{ backgroundColor: "#0000", marginLeft: "180px" }}
                  >
                    <HiMiniUserGroup
                      style={{ color: "#ffffff", fontSize: "2em" }}
                    />
                  </div>
                  <p className="card-text score display-5">{candidatecount}</p>
                </div>

                <div className="card-body  hr admincardhover mb-1">
                  <h5 className="card-title headline">Active Users</h5>
                  <div
                    style={{ backgroundColor: "#0000", marginLeft: "180px" }}
                  >
                    <FaUserCheck
                      style={{ color: "#ffffff", fontSize: "2em" }}
                    />
                  </div>
                  <p className="card-text score display-5">
                    {activeUsersCount}
                  </p>
                </div>

                <div className="card-body  hr admincardhover mb-1">
                  <h5 className="card-title headline">Inactive Users</h5>
                  <div
                    style={{ backgroundColor: "#0000", marginLeft: "180px" }}
                  >
                    <FaUserXmark
                      style={{ color: "#ffffff", fontSize: "2em" }}
                    />
                  </div>
                  <p className="card-text score display-5">
                    {inactiveUsersCount}
                  </p>
                </div>
              </div>

              <div className=" linechart mt-3 w-100">
                <CanvasJSChart options={data} animationEnabled={true} />
              </div>
            </div>
            <div className="container-fluid">
              <div className="row mt-2 ">
                <div className="col-lg-6">
                  <div className="container-fluid">
                    <div className="row mt-3">
                      <div className="col">
                        <div className="card-body1 candidate applied admincardhover">
                          <h5 className="card-title headline1">Applied</h5>
                          <p className="card-text score display-5">
                            {appliedCount}
                          </p>
                        </div>
                      </div>
                      <div className="col">
                        <div className="card-body1 candidate review admincardhover">
                          <h5 className="card-title headline1">Under Review</h5>
                          <p className="card-text score display-5">
                            {underReviewCount}
                          </p>
                        </div>
                      </div>
                      <div className="col">
                        <div className="card-body1 candidate interview admincardhover">
                          <h5 className="card-title headline1">
                            Interview Scheduled
                          </h5>
                          <p className="card-text score display-5">
                            {interviewScheduledCount}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col">
                        <div className="card-body1 candidate selected admincardhover">
                          <h5 className="card-title headline1">Selected</h5>
                          <p className="card-text score display-5">
                            {selectedCount}
                          </p>
                        </div>
                      </div>
                      <div className="col">
                        <div className="card-body1 candidate rejected admincardhover">
                          <h5 className="card-title headline1">Rejected</h5>
                          <p className="card-text score display-5">
                            {rejectedCount}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="container-fluid m-3">
                    <CanvasJSChart options={options} />
                  </div>
                </div>
              </div>
            </div>
            <div className="container-fluid">
              <div className="row mt-2">
                <div className="d-flex flex-md-row  flex-column justify-content-between align-items-center">
                  <h2>Candidates List</h2>
                  {/* <div className='col-4 d-flex align-items-center justify-content-end'> */}
                  <div
                    className="form-group"
                    style={{ backgroundColor: "transparent" }}
                  >
                    <div className="form-group  d-flex">
                      {/* <button className="btn btn-primary" onClick={this.toggleDateInput}>
                            <SlCalender />
                          </button> */}
                      {
                        <div>
                          <DatePicker
                            selected={startDate}
                            onChange={this.handleStartDateChange}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                            placeholderText="Start Date"
                            className="form-control startdate"
                            dateFormat="dd-MM-yyyy"
                          />
                          <div className="input-group-append">
                            <span className="input-group-text btn btn-primary calender">
                              <SlCalender />
                            </span>
                          </div>
                        </div>
                      }

                      {
                        <div>
                          <DatePicker
                            selected={endDate}
                            onChange={this.handleEndDateChange}
                            selectsEnd
                            startDate={startDate}
                            endDate={endDate}
                            minDate={startDate}
                            placeholderText="End Date "
                            className="form-control startdate"
                            dateFormat="dd-MM-yyyy"
                          />
                          <div className="input-group-append">
                            <span className="input-group-text btn btn-primary calender">
                              <SlCalender />
                            </span>
                          </div>
                        </div>
                      }

                      {/* <button className="btn btn-primary" onClick={this.toggleNameInput} style={{ marginLeft: '30px' }}>
                            <ImSearch />
                          </button> */}
                      {
                        <div className="input-group">
                          <div className="form-outline ">
                            <input
                              type="search"
                              className="form-control "
                              placeholder="Enter Candidate Name"
                              value={filterName}
                              onChange={this.handleNameChange}
                            />

                            <button
                              className="btn btn-primary admintablesearchicon text-xs "
                              // style={{
                              //   position: "absolute",
                              //   right: "0px",
                              //   top: "0px",
                              // }}
                            >
                              <i className="fas fa-search"></i>
                            </button>
                          </div>
                        </div>
                      }
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <DataTable
                  columns={columns}
                  data={filteredUsers}
                  pagination
                  paginationPerPage={userItemsPerPage}
                  paginationRowsPerPageOptions={[3, 5, 10, 15]} // Optional: Customize rows per page options
                  paginationComponentOptions={{
                    rowsPerPageText: "Rows per page:", // Customize text for rows per page label
                  }}
                  paginationTotalRows={filteredUsers.length}
                  onChangePage={this.handleUserPageChange}
                />
              </div>

              <div className="row mt-2">
                <div className="d-flex flex-md-row  flex-column justify-content-between align-items-center">
                  <h2>Job Opening List</h2>
                  <div
                    className="form-group"
                    style={{ backgroundColor: "transparent" }}
                  >
                    <div className="form-group d-flex">
                      <div>
                        <DatePicker
                          selected={startDate2}
                          onChange={this.handleStartDateChange2}
                          selectsStart
                          startDate={startDate2}
                          endDate={endDate2}
                          placeholderText="Start Date"
                          className="form-control startdate"
                          dateFormat="dd-MM-yyyy"
                        />

                        <div className="input-group-append">
                          <span className="input-group-text btn btn-primary calender">
                            <SlCalender />
                          </span>
                        </div>
                      </div>

                      {
                        <div>
                          <DatePicker
                            selected={endDate2}
                            onChange={this.handleEndDateChange2}
                            selectsEnd
                            startDate2={startDate2}
                            endDate2={endDate2}
                            minDate={startDate2}
                            placeholderText="End Date"
                            className="form-control startdate"
                            dateFormat="dd-MM-yyyy"
                          />
                          <div className="input-group-append">
                            <span className="input-group-text btn btn-primary calender">
                              <SlCalender />
                            </span>
                          </div>
                        </div>
                      }
                      {
                        <div className="input-group">
                          <div className="form-outline w-100  ">
                            <input
                              type="search"
                              className="form-control "
                              placeholder="Search Job Title"
                              value={filterName2}
                              onChange={this.handleNameChange2}
                            />

                            <button className="btn btn-primary admintablesearchicon text-xs ">
                              <i className="fas fa-search"></i>
                            </button>
                          </div>
                        </div>
                      }
                    </div>
                    {/* </div> */}
                  </div>
                </div>
                {/* </h2> */}
              </div>
              <div>
                <DataTable
                  columns={columns_job}
                  data={filteredJobOpenings}
                  pagination
                  paginationPerPage={userItemsPerPage}
                  paginationRowsPerPageOptions={[3, 5, 10, 15]} // Optional: Customize rows per page options
                  paginationComponentOptions={{
                    rowsPerPageText: "Rows per page:", // Customize text for rows per page label
                  }}
                  paginationTotalRows={filteredJobOpenings.length}
                  onChangePage={this.handleUserPageChange}
                />
              </div>
              <div className="row mt-2">
                <div className="d-flex flex-md-row  flex-column justify-content-between align-items-center">
                  <h2>Personality Test</h2>
                  <div
                    className="form-group"
                    style={{ backgroundColor: "transparent" }}
                  >
                    <div className="form-group  d-flex">
                      <select
                        onChange={this.handleTraitChange}
                        value={this.selectedTrait}
                        style={{
                          width: "200px",
                          borderRadius: "5px",
                          padding: "5px",
                          backgroundColor: "white",
                          color: "#606060",
                          border: "1px solid #C0C0C0",
                          boxshadow: "rgba(3, 102, 214, 0.3) 0px 0px 0px 3px",
                        }}
                      >
                        <option value="">Choose Personality</option>
                        {this.traitOptions.map((option, index) => (
                          <option key={index} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {/* <Dropdown
                        disabled={false} // Set to true if you want the dropdown to be disabled
                        onChange={this.handleTraitChange}
                        value={this.selectedTrait} // Set the default selected option
                        options={[
                          { value: "", label: 'Select a trait' },
                            this.traitOptions.map((option, index) => (
                              <option key={index} value={option.value}>{option.label}</option>
                            ))
                        ]}
                        placeholder="Select an option" // Placeholder text for the dropdown
                      /> */}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <DataTable
                  columns={columns_personality}
                  data={this.state.filteredData}
                  pagination
                  paginationPerPage={userItemsPerPage}
                  paginationRowsPerPageOptions={[3, 5, 10, 15]} // Optional: Customize rows per page options
                  paginationComponentOptions={{
                    rowsPerPageText: "Rows per page:", // Customize text for rows per page label
                  }}
                  paginationTotalRows={columns_personality.length}
                  onChangePage={this.handleUserPageChange}
                />
              </div>
            </div>
          </div>
        </div>
        {/* </div> */}
      </>
    );
  }
}

export default AdminDashboard;
