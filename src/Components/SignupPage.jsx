import React, { useState, useRef } from "react";
import "../Styling/SignupPage.css";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  const [ProfileImageFile, setProfileImageFile] = useState(null);
  const fileInputRef = useRef(null);
  const [signupDetails, setSignupDetails] = useState({
    signupEmailID: "",
    userName: "",
    password: "",
    confirmPassword: "",
  });

  const handleImageChange = (e) => {
    setProfileImageFile(e.target.files[0]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupDetails({
      ...signupDetails,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (signupDetails.password !== signupDetails.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("signupEmailID", signupDetails.signupEmailID);
      formData.append("userName", signupDetails.userName);
      formData.append("password", signupDetails.password);
      formData.append("confirmPassword", signupDetails.confirmPassword);

      if (ProfileImageFile) {
        formData.append("ProfileImageFile", ProfileImageFile);
      }

      const response = await fetch(
        "https://carrental-backend-9bti.onrender.com/api/SignupDetails/UploadSignupDetails",
        {
          method: "POST",
          body: formData, // Send FormData
        }
      );

      if (response.ok) {
        setMessage("Signup details uploaded successfully.");
        setShowPopup(true);
      } else {
        const errorMessage = await response.text();
        alert(errorMessage || "An error occurred while uploading signup details.");
      }
    } catch (error) {
      console.error("Error uploading signup details:", error);
      alert("An error occurred while uploading signup details.");
    }
  };

  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleOkClick = () => {
    setShowPopup(false);
    navigate("/LoginPage"); // Navigate to LoginPage after closing popup
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="signupform-container">
        <div className="p-2 fs-4 fw-bold bg-light text-dark">SIGNUP</div>
        <div className="Signupform-input-container">
          <div style={{ width: "350px" }}>
            <div className="input-container">
              <input
                className="login-input"
                placeholder=""
                type="text"
                name="userName"
                value={signupDetails.userName}
                onChange={handleChange}
                autoComplete="off"
                required
              />
              <label className="text-light floating-label">⭐Username:</label>
            </div>
            <div className="input-container">
              <input
                className="login-input"
                placeholder=""
                type="email"
                name="signupEmailID"
                value={signupDetails.signupEmailID}
                onChange={handleChange}
                autoComplete="off"
                required
              />
              <label className="text-light floating-label">⭐Email:</label>
            </div>
            <div className="input-container">
              <input
                className="login-input"
                placeholder=""
                type="password"
                name="password"
                value={signupDetails.password}
                onChange={handleChange}
                autoComplete="off"
                required
              />
              <label className="text-light floating-label">⭐Password:</label>
            </div>
            <div className="input-container">
              <input
                className="login-input"
                placeholder=""
                type="password"
                name="confirmPassword"
                value={signupDetails.confirmPassword}
                onChange={handleChange}
                autoComplete="off"
                required
              />
              <label className="text-light floating-label">
                ⭐Confirm Password:
              </label>
            </div>
            <div className="input-container">
              
              <input
                className="login-input"
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                ref={fileInputRef}
              />
              <label className="text-light floating-label">⭐Profile Image</label>
            </div>
            <div className="d-flex justify-content-center">
              <button className="signup-button" type="submit">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Popup */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <p className="text-white">{message}</p>
            <button className="" onClick={handleOkClick}>
              Ok
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
