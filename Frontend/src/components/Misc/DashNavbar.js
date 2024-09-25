// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import AuthService from "../Authentication/authService";
// import { useNavigate } from "react-router-dom";
// import { FaUser, FaCog, FaSignOutAlt, FaBell } from "react-icons/fa";
// import "../css/index.css";
// import ProfileModal from "./ProfileModal";
// import brandlogo from "../../Assets/tdtl_logo.png";
// import {
//   Modal,
//   Button,
//   Dropdown,
//   Popover,
//   OverlayTrigger,
// } from "react-bootstrap";
// import userprofile from "../../Assets/userprofile.png";
// import axios from "axios";

// export default function DashNavbar(props) {
//   const Navigate = useNavigate();
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [userName, setUserName] = useState("");
//   const [showProfileModal, setShowProfileModal] = useState(false);
//   const [notifications, setNotifications] = useState([]);
//   // const [showDrawer, setShowDrawer] = useState(false);
//   // const [showNotificationModal, setShowNotificationModal] = useState(false);
//   const [userData, setUserData] = useState(null);
//   const [profilePictureBlobURL, setProfilePictureBlobURL] = useState(null);

//   useEffect(() => {
//     let temp = localStorage.getItem("email");
//     const fetchData = async () => {
//       try {
//         const response = await axios.post(
//           "http://127.0.0.1:8000/UserProfile/",
//           {
//             email: temp,
//           }
//         );

//         setUserData(response.data.user_data);
//       } catch (error) {
//         console.error("Error fetching data:", error.message);
//       }
//     };

//     fetchData();
//   }, []);

//   useEffect(() => {
//     if (userData && !userData.profile_picture) {
//       const fetchProfilePicture = async () => {
//         try {
//           const response = await axios.get(
//             `http://127.0.0.1:8000/profile-picture/${userData.id}/`,
//             {
//               responseType: "blob", // Set responseType to 'blob' to receive binary data
//             }
//           );
//           // Create a Blob URL from the binary data received
//           const blobURL = URL.createObjectURL(response.data);
//           setProfilePictureBlobURL(blobURL);
//         } catch (error) {
//           console.error("Error fetching profile picture:", error.message);
//           // Handle error
//         }
//       };

//       fetchProfilePicture();
//     }
//   }, [userData]);

//   useEffect(() => {
//     const storedUserName = localStorage.getItem("UserName");
//     if (storedUserName) {
//       setUserName(storedUserName);
//       setShowDropdown(true);
//     }
//     const storedRole = localStorage.getItem("User_Role");
//     if (storedRole) {
//       fetchNotifications(storedRole);
//     }
//   }, []);

//   const fetchNotifications = async (storedRole) => {
//     console.log("Role:", storedRole);
//     try {
//       const response = await axios.get(
//         `http://127.0.0.1:8000/get_notifications/?role=${storedRole}`
//       );
//       setNotifications(response.data.notifications);
//     } catch (error) {
//       console.error("Error fetching notifications:", error);
//     }
//   };

//   const handleProfileClick = () => {
//     setShowProfileModal(true);
//   };

//   const handleLogout = () => {
//     AuthService.logout()
//       .then(() => {
//         Navigate("/sign-in");
//         localStorage.clear();
//       })
//       .catch((error) => {
//         console.error("Logout Error:", error);
//       });
//   };
//   const handleBellClick = async () => {
//     // if (props.setNewJobCount) {
//     //   props.setNewJobCount(0);
//     // }
//     await fetchNotifications(localStorage.getItem("User_Role")); // Refresh notifications on bell click
//     // setShowDrawer(true);
//     // setShowNotificationModal(true); // Open the notification modal
//   };

//   const getTimeDifference = (notificationTime) => {
//     const currentTime = new Date();
//     const notificationDate = new Date(notificationTime);
//     const timeDifference = currentTime.getTime() - notificationDate.getTime();
//     const seconds = Math.floor(timeDifference / 1000);
//     const minutes = Math.floor(seconds / 60);
//     const hours = Math.floor(minutes / 60);
//     const days = Math.floor(hours / 24);

//     if (days > 0) {
//       return `${days} day${days > 1 ? "s" : ""} ago`;
//     } else if (hours > 0) {
//       return `${hours} hour${hours > 1 ? "s" : ""} ago`;
//     } else if (minutes > 0) {
//       return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
//     } else {
//       return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
//     }
//   };

//   const popover = (
//     <Popover id="popover-notifications">
//       <Popover.Header as="h3">Notifications</Popover.Header>
//       <Popover.Body style={{ maxHeight: "50vh", overflowY: "auto" }}>
//         <div className="notification-list">
//           {notifications.map((notification, index) => (
//             <div key={index} className="notification-item">
//               <p className="notification-msg">{notification.message}</p>
//               <p className="notification-time">
//                 {getTimeDifference(notification.time)}
//               </p>
//             </div>
//           ))}
//         </div>
//       </Popover.Body>
//     </Popover>
//   );

//   return (
//     <>
//       <nav className="navbar navbar-expand navbar-dark gradient-navbar">
//         <div className="container custom-container-width d-flex align-items-center">
//           {/* Brand Logo */}
//           <Link className="navbar-brand" to={"/Admindashboard"}>
//             <img
//               src={brandlogo}
//               alt="Logo"
//               style={{ height: "1.7em", width: "7.5em" }}
//             />
//           </Link>

//           {/* Bell Icon and User Dropdown */}
//           <div className="d-flex align-items-center">
//             {/* Bell Icon */}
//             <OverlayTrigger
//               trigger="click"
//               placement="bottom"
//               overlay={popover}
//             >
//               <div className="bell-icon mr-3" onClick={handleBellClick}>
//                 <FaBell
//                   style={{
//                     fontSize: "1.5em",
//                     color: "white",
//                     marginRight: "0.7em",
//                   }}
//                 />
//                 {<span className="badge bg-danger bell-badge"></span>}
//               </div>
//             </OverlayTrigger>
//             {/* User Dropdown */}
//             {showDropdown && (
//               <div className="user-dropdown">
//                 <div className="d-flex align-items-center">
//                   <span className="user-name-container">
//                     {userName && (
//                       <span className="user-name text-light me-2">
//                         {userName}
//                       </span>
//                     )}
//                   </span>
//                   <div
//                     className="nav-profile-picture-container mx-2 position-relative"
//                     onClick={handleProfileClick}
//                   >
//                     <img
//                       src={
//                         profilePictureBlobURL ||
//                         userData?.profile_picture ||
//                         userprofile
//                       }
//                       alt="Profile"
//                       className="nav-profile-picture"
//                     />
//                   </div>

//                   <button
//                     className="px-2 border-0 dropdown-toggle"
//                     style={{
//                       backgroundColor: "transparent",
//                       color: "white",
//                     }}
//                     type="button"
//                     id="userDropdown"
//                     data-bs-toggle="dropdown"
//                     aria-expanded="false"
//                   ></button>
//                   <ul
//                     className="dropdown-menu dropdown-menu-end me-3"
//                     aria-labelledby="userDropdown"
//                   >
//                     <li>
//                       <button
//                         className="dropdown-item for-hover"
//                         onClick={handleProfileClick}
//                       >
//                         <FaUser className="me-2" />
//                         Profile
//                       </button>
//                     </li>
//                     <li>
//                       <Link
//                         className="dropdown-item for-hover"
//                         to={"/settings"}
//                       >
//                         <FaCog className="me-2" />
//                         Settings
//                       </Link>
//                     </li>
//                     <li>
//                       <Link
//                         className="dropdown-item for-hover"
//                         onClick={handleLogout}
//                       >
//                         <FaSignOutAlt className="me-2" />
//                         Log out
//                       </Link>
//                     </li>
//                   </ul>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </nav>

//       {/* Profile Modal */}
//       <ProfileModal
//         show={showProfileModal}
//         onClose={() => setShowProfileModal(false)}
//         userName={userName}
//       />
//     </>
//   );
// }

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthService from "../Authentication/authService";
import { useNavigate } from "react-router-dom";
import { FaUser, FaCog, FaSignOutAlt, FaBell } from "react-icons/fa";
import "../css/index.css";
import ProfileModal from "./ProfileModal";
import brandlogo from "../../Assets/tdtl_logo.png";
import { Popover, Badge, OverlayTrigger } from "react-bootstrap";
import userprofile from "../../Assets/userprofile.png";
import axios from "axios";

export default function DashNavbar(props) {
  const Navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [userName, setUserName] = useState("");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  // const [showDrawer, setShowDrawer] = useState(false);
  // const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const [profilePictureBlobURL, setProfilePictureBlobURL] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    let temp = localStorage.getItem("email");
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/UserProfile/",
          {
            email: temp,
          }
        );

        setUserData(response.data.user_data);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (userData && !userData.profile_picture) {
      const fetchProfilePicture = async () => {
        try {
          const response = await axios.get(
            `http://127.0.0.1:8000/profile-picture/${userData.id}/`,
            {
              responseType: "blob", // Set responseType to 'blob' to receive binary data
            }
          );
          // Create a Blob URL from the binary data received
          const blobURL = URL.createObjectURL(response.data);
          setProfilePictureBlobURL(blobURL);
        } catch (error) {
          console.error("Error fetching profile picture:", error.message);
          // Handle error
        }
      };

      fetchProfilePicture();
    }
  }, [userData]);

  useEffect(() => {
    const storedUserName = localStorage.getItem("UserName");
    if (storedUserName) {
      setUserName(storedUserName);
      setShowDropdown(true);
    }
    const storedRole = localStorage.getItem("User_Role");
    if (storedRole) {
      fetchNotifications(storedRole);
    }
  }, []);

  const fetchNotifications = async (storedRole) => {
    console.log("Role:", storedRole);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/get_notifications/?role=${storedRole}`
      );
      setNotifications(response.data.notifications);
      setNotificationCount(response.data.notifications.length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleProfileClick = () => {
    setShowProfileModal(true);
  };

  const handleLogout = () => {
    AuthService.logout()
      .then(() => {
        Navigate("/sign-in");
        localStorage.clear();
      })
      .catch((error) => {
        console.error("Logout Error:", error);
      });
  };
  const handleBellClick = async () => {
    // if (props.setNewJobCount) {
    //   props.setNewJobCount(0);
    // }
    await fetchNotifications(localStorage.getItem("User_Role")); // Refresh notifications on bell click
    // setShowDrawer(true);
    // setShowNotificationModal(true); // Open the notification modal
    setNotificationCount(0);
  };

  const getTimeDifference = (notificationTime) => {
    const currentTime = new Date();
    const notificationDate = new Date(notificationTime);
    const timeDifference = currentTime.getTime() - notificationDate.getTime();
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else {
      return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
    }
  };

  const popover = () => (
    <Popover id="popover-notifications">
      <Popover.Header as="h3">Notifications</Popover.Header>
      <Popover.Body style={{ maxHeight: "50vh", overflowY: "auto" }}>
        <div className="notification-list">
          {notifications.map((notification, index) => (
            <div key={index} className="notification-item">
              <p className="notification-msg">{notification.message}</p>
              <p className="notification-time">
                {getTimeDifference(notification.time)}
              </p>
            </div>
          ))}
        </div>
      </Popover.Body>
    </Popover>
  );

  return (
    <>
      <nav className="navbar navbar-expand navbar-dark gradient-navbar">
        <div className="container custom-container-width d-flex align-items-center">
          {/* Brand Logo */}
          <Link className="navbar-brand" to={"/Admindashboard"}>
            <img
              src={brandlogo}
              alt="Logo"
              style={{ height: "1.7em", width: "8em" }}
            />
          </Link>

          {/* Bell Icon and User Dropdown */}
          <div className="d-flex align-items-center">
            {/* Bell Icon */}
            <OverlayTrigger
              trigger="click"
              placement="bottom"
              overlay={popover()}
            >
              <div className="bell-icon mr-3" onClick={handleBellClick}>
                <FaBell
                  style={{
                    fontSize: "1.5em",
                    color: "white",
                    marginRight: "0.7em",
                  }}
                />
                {notificationCount > 0 && (
                  <Badge bg="danger" className="bell-badge">
                    {notificationCount}
                  </Badge>
                )}
              </div>
            </OverlayTrigger>
            {/* User Dropdown */}
            {showDropdown && (
              <div className="user-dropdown">
                <div className="d-flex align-items-center">
                  <span className="user-name-container">
                    {userName && (
                      <span className="user-name text-light me-2">
                        {userName}
                      </span>
                    )}
                  </span>
                  <div
                    className="nav-profile-picture-container mx-2 position-relative"
                    onClick={handleProfileClick}
                  >
                    <img
                      src={
                        profilePictureBlobURL ||
                        userData?.profile_picture ||
                        userprofile
                      }
                      alt="Profile"
                      className="nav-profile-picture"
                    />
                  </div>

                  <button
                    className="px-2 border-0 dropdown-toggle"
                    style={{
                      backgroundColor: "transparent",
                      color: "white",
                    }}
                    type="button"
                    id="userDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  ></button>
                  <ul
                    className="dropdown-menu dropdown-menu-end me-3"
                    aria-labelledby="userDropdown"
                  >
                    <li>
                      <button
                        className="dropdown-item for-hover"
                        onClick={handleProfileClick}
                      >
                        <FaUser className="me-2" />
                        Profile
                      </button>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item for-hover"
                        to={"/settings"}
                      >
                        <FaCog className="me-2" />
                        Settings
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item for-hover"
                        onClick={handleLogout}
                      >
                        <FaSignOutAlt className="me-2" />
                        Log out
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Profile Modal */}
      <ProfileModal
        show={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        userName={userName}
      />
    </>
  );
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import AuthService from "../Authentication/authService";
// import { useNavigate } from "react-router-dom";
// import { FaUser, FaCog, FaSignOutAlt, FaBell } from "react-icons/fa";
// import "../css/index.css";
// import ProfileModal from "./ProfileModal";
// import brandlogo from "../../Assets/tdtl_logo.png";
// import { Popover, Badge, OverlayTrigger } from "react-bootstrap";
// import userprofile from "../../Assets/userprofile.png";
// import axios from "axios";

// export default function DashNavbar(props) {
//   const Navigate = useNavigate();
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [userName, setUserName] = useState("");
//   const [showProfileModal, setShowProfileModal] = useState(false);
//   const [notifications, setNotifications] = useState([]);
//   const [userData, setUserData] = useState(null);
//   const [profilePictureBlobURL, setProfilePictureBlobURL] = useState(null);

//   useEffect(() => {
//     let temp = localStorage.getItem("email");
//     const fetchData = async () => {
//       try {
//         const response = await axios.post(
//           "http://127.0.0.1:8000/UserProfile/",
//           { email: temp }
//         );
//         setUserData(response.data.user_data);
//       } catch (error) {
//         console.error("Error fetching data:", error.message);
//       }
//     };

//     fetchData();
//   }, []);

//   useEffect(() => {
//     if (userData && !userData.profile_picture) {
//       const fetchProfilePicture = async () => {
//         try {
//           const response = await axios.get(
//             `http://127.0.0.1:8000/profile-picture/${userData.id}/`,
//             { responseType: "blob" }
//           );
//           const blobURL = URL.createObjectURL(response.data);
//           setProfilePictureBlobURL(blobURL);
//         } catch (error) {
//           console.error("Error fetching profile picture:", error.message);
//         }
//       };

//       fetchProfilePicture();
//     }
//   }, [userData]);

//   useEffect(() => {
//     const storedUserName = localStorage.getItem("UserName");
//     if (storedUserName) {
//       setUserName(storedUserName);
//       setShowDropdown(true);
//     }
//   }, []);

//   const fetchNotifications = async () => {
//     const storedRole = localStorage.getItem("User_Role");
//     console.log("Role:", storedRole);
//     try {
//       const response = await axios.get(
//         `http://127.0.0.1:8000/get_notifications/?role=${storedRole}`
//       );
//       setNotifications(response.data.notifications);
//     } catch (error) {
//       console.error("Error fetching notifications:", error);
//     }
//   };

//   const handleProfileClick = () => {
//     setShowProfileModal(true);
//   };

//   const handleLogout = () => {
//     AuthService.logout()
//       .then(() => {
//         Navigate("/sign-in");
//         localStorage.clear();
//       })
//       .catch((error) => {
//         console.error("Logout Error:", error);
//       });
//   };

//   const handleBellClick = async () => {
//     await fetchNotifications();
//   };

//   const getTimeDifference = (notificationTime) => {
//     const currentTime = new Date();
//     const notificationDate = new Date(notificationTime);
//     const timeDifference = currentTime.getTime() - notificationDate.getTime();
//     const seconds = Math.floor(timeDifference / 1000);
//     const minutes = Math.floor(seconds / 60);
//     const hours = Math.floor(minutes / 60);
//     const days = Math.floor(hours / 24);

//     if (days > 0) {
//       return `${days} day${days > 1 ? "s" : ""} ago`;
//     } else if (hours > 0) {
//       return `${hours} hour${hours > 1 ? "s" : ""} ago`;
//     } else if (minutes > 0) {
//       return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
//     } else {
//       return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
//     }
//   };

//   const popover = () => (
//     <Popover id="popover-notifications">
//       <Popover.Header as="h3">Notifications</Popover.Header>
//       <Popover.Body style={{ maxHeight: "50vh", overflowY: "auto" }}>
//         <div className="notification-list">
//           {notifications.map((notification, index) => (
//             <div key={index} className="notification-item">
//               <p className="notification-msg">{notification.message}</p>
//               <p className="notification-time">
//                 {getTimeDifference(notification.time)}
//               </p>
//             </div>
//           ))}
//         </div>
//       </Popover.Body>
//     </Popover>
//   );

//   return (
//     <>
//       <nav className="navbar navbar-expand navbar-dark gradient-navbar">
//         <div className="container custom-container-width d-flex align-items-center">
//           <Link className="navbar-brand" to={"/Admindashboard"}>
//             <img
//               src={brandlogo}
//               alt="Logo"
//               style={{ height: "1.7em", width: "7.5em" }}
//             />
//           </Link>

//           <div className="d-flex align-items-center">
//             <OverlayTrigger
//               trigger="click"
//               placement="bottom"
//               overlay={popover()}
//               onEnter={fetchNotifications} // Fetch notifications when popover is opened
//             >
//               <div className="bell-icon mr-3" onClick={handleBellClick}>
//                 <FaBell
//                   style={{
//                     fontSize: "1.5em",
//                     color: "white",
//                     marginRight: "0.7em",
//                   }}
//                 />
//                 <Badge bg="danger" className="bell-badge">
//                   {notifications.length}
//                 </Badge>
//               </div>
//             </OverlayTrigger>

//             {showDropdown && (
//               <div className="user-dropdown">
//                 <div className="d-flex align-items-center">
//                   <span className="user-name-container">
//                     {userName && (
//                       <span className="user-name text-light me-2">
//                         {userName}
//                       </span>
//                     )}
//                   </span>
//                   <div
//                     className="nav-profile-picture-container mx-2 position-relative"
//                     onClick={handleProfileClick}
//                   >
//                     <img
//                       src={
//                         profilePictureBlobURL ||
//                         userData?.profile_picture ||
//                         userprofile
//                       }
//                       alt="Profile"
//                       className="nav-profile-picture"
//                     />
//                   </div>

//                   <button
//                     className="px-2 border-0 dropdown-toggle"
//                     style={{
//                       backgroundColor: "transparent",
//                       color: "white",
//                     }}
//                     type="button"
//                     id="userDropdown"
//                     data-bs-toggle="dropdown"
//                     aria-expanded="false"
//                   ></button>
//                   <ul
//                     className="dropdown-menu dropdown-menu-end me-3"
//                     aria-labelledby="userDropdown"
//                   >
//                     <li>
//                       <button
//                         className="dropdown-item for-hover"
//                         onClick={handleProfileClick}
//                       >
//                         <FaUser className="me-2" />
//                         Profile
//                       </button>
//                     </li>
//                     <li>
//                       <Link
//                         className="dropdown-item for-hover"
//                         to={"/settings"}
//                       >
//                         <FaCog className="me-2" />
//                         Settings
//                       </Link>
//                     </li>
//                     <li>
//                       <Link
//                         className="dropdown-item for-hover"
//                         onClick={handleLogout}
//                       >
//                         <FaSignOutAlt className="me-2" />
//                         Log out
//                       </Link>
//                     </li>
//                   </ul>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </nav>

//       <ProfileModal
//         show={showProfileModal}
//         onClose={() => setShowProfileModal(false)}
//         userName={userName}
//       />
//     </>
//   );
// }
