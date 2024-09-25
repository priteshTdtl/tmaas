import React, { useEffect, useState, useRef } from "react";
import { Modal } from "bootstrap";
import userprofile from "../../Assets/userprofile.png";
import "./ProfileModal.css";
import axios from "axios";

const ProfileModal = ({ show, onClose, userName }) => {
  const modalRef = useRef(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profilePictureBlobURL, setProfilePictureBlobURL] = useState(null);

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
        setError(
          "An error occurred while fetching user data. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [show]);

  useEffect(() => {
    if (modalRef.current && show) {
      const modal = new Modal(modalRef.current);
      modal.show();
    }
  }, [show, modalRef]);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("profile_picture", file);
    const user_id = localStorage.getItem("user_id");
    formData.append("user_id", user_id);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/upload-profile-picture/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          // Add responseType to receive binary data
          responseType: "arraybuffer",
        }
      );
      setUserData({
        ...userData,
        profile_picture: response.data.profile_picture_url,
      });

      // Create a Blob from the binary data received
      const blob = new Blob([response.data], { type: "image/jpeg" });

      // Generate Blob URL
      const blobURL = URL.createObjectURL(blob);

      // Update profilePictureBlobURL with the new profile picture Blob URL
      setProfilePictureBlobURL(blobURL);

      window.location.reload();
    } catch (error) {
      console.error("Error uploading profile picture:", error.message);
    }
  };

  useEffect(() => {
    if (userData && !userData.profile_picture) {
      const fetchProfilePicture = async () => {
        try {
          const response = await axios.get(
            `http://127.0.0.1:8000/profile-picture/${userData.id}/`,
            {
              responseType: "blob",
            }
          );

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
    if (modalRef.current && !show) {
      const modal = new Modal(modalRef.current);
      modal.hide();
    }
  }, [show, modalRef]);

  const hideModal = () => {
    const modalElement = modalRef.current;
    const modalInstance = new Modal(modalElement);
    modalInstance.hide();
  };

  return (
    <>
      <div
        className="modal fade"
        ref={modalRef}
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">User Profile</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={onClose || hideModal}
              ></button>
            </div>
            <div className="modal-body">
              <p>Welcome, {userName}</p>
              {loading ? (
                <p>Loading...</p>
              ) : error ? (
                <p>{error}</p>
              ) : userData ? (
                <div className="d-flex flex-column align-items-center text-center mt-3">
                  <div className="profile-picture-container">
                    <img
                      src={
                        profilePictureBlobURL ||
                        userData.profile_picture ||
                        userprofile
                      }
                      alt="Profile"
                      className="profile-picture"
                    />
                  </div>
                  <div className="mt-4">
                    <h4>{userData.name}</h4>
                    <p className="text-secondary mb-1">{userData.email}</p>
                    <label htmlFor="profilePicture" className="btn btn-info">
                      Upload Profile Picture
                      <input
                        id="profilePicture"
                        type="file"
                        accept="image/*"
                        className="form-control d-none"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileModal;
