import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../Styling/Header.css";
import { useChat } from "./ChatContext";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const handleStateChange = (e) => {
      if (e.detail && typeof e.detail.open !== "undefined") {
        setFiltersOpen(e.detail.open);
      }
    };
    window.addEventListener("filters-state-changed", handleStateChange);
    return () => {
      window.removeEventListener("filters-state-changed", handleStateChange);
    };
  }, []);

  const handleHamburgerClick = () => {
    const event = new CustomEvent("toggle-filters");
    window.dispatchEvent(event);
  };

  const handleClick = () => {
    setMenuOpen(false);
  };

  // Highlight active page header background
  const location = useLocation();
  useEffect(() => {
    const homeLink = document.querySelector(".app-header-option.ms-0");
    if (location.pathname === "/") {
      homeLink.classList.add("active");
    } else {
      homeLink.classList.remove("active");
    }
  }, [location]);

  // Profile popup
  const [showProfile, setShowProfile] = useState(false);

  // Getting logged-in user details from cookies
  const getCookieValue = (name) => {
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    return match ? decodeURIComponent(match[2]) : null;
  };

  const [user, setUser] = useState(null);
  const userDataString = getCookieValue("user");
  const [error, setError] = useState(null);
  const [profilepic, setProfilepic] = useState([]);

  const { unreadMessages } = useChat() || {};
  const hasUnread = unreadMessages ? Object.values(unreadMessages).some((count) => count > 0) : false;

  useEffect(() => {
    if (userDataString) {
      const Parsedata = JSON.parse(userDataString);
      setUser(Parsedata);
    } else {
      console.log("No parsed data");
    }
  }, [userDataString]);

  useEffect(() => {
    const fetchImages = async () => {
      if (!user) {
        setError("User email not found");
        return;
      }

      try {
        const response = await fetch(
          `https://localhost:7189/api/SignupDetails/GetProfileImageData/${user.email}`
        );
        if (response.ok) {
          const data = await response.json();
          setProfilepic(data);
        } else {
          console.error("Profile image not found");
        }
      } catch (error) {
        console.error("Error fetching profile image:", error);
      }
    };
    if (user) {
      fetchImages();
    }
  }, [user]);

  const fileInputRef = useRef(null); // Ref for file input
  const [selectedFile, setSelectedFile] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleSaveImage = async () => {
    if (!selectedFile) {
      alert("Please select an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("ProfileImageFile", selectedFile); // Image file
    formData.append("SignupEmailID", user.email); // Email ID of the logged-in user

    try {
      const response = await fetch(
        "https://localhost:7189/api/SignupDetails/UpdateProfileImageData", // API endpoint
        {
          method: "PUT",
          body: formData,
        }
      );

      if (response.ok) {
        // Check if the response is in JSON format
        const contentType = response.headers.get("Content-Type");

        if (contentType && contentType.includes("application/json")) {
          const result = await response.json(); // Parse JSON response
          if (result) {
            // Assuming the backend responds with updated profile image data
            console.log("Profile image updated successfully", result);
            setProfilepic(result); // Update the profile picture with the new data
          } else {
            alert("Failed to fetch updated profile image.");
          }
        } else {
          // If the response is plain text (e.g., success message)
          const textResult = await response.text(); // Parse text response
          console.log("Profile image updated successfully: ", textResult);
        }

        setSelectedFile(null); // Reset selected file after upload
      } else {
        alert("Failed to update profile image. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile image:", error);
      alert("An error occurred while updating the profile image.");
    }
  };

  // Logout button to clear user details and cookies
  const navigate = useNavigate();
  const handleLogoutClick = () => {
    document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setUser(null);
    setShowProfile(false);
    window.location.reload();
  };

  const handleLogin = () => {
    navigate("/LoginPage");
    setShowProfile(false);
  };

  const [showExtendedSettings, setShowExtendedSettings] = useState(false);
  const handleSettingsToggle = () => {
    setShowExtendedSettings((prevState) => !prevState);
  };

  // Function to delete profile image
  const deleteProfileImage = async () => {
    if (!user) {
      alert("User data not found. Please log in.");
      return;
    }

    try {
      const response = await fetch(
        `https://localhost:7189/api/SignupDetails/DeleteProfileImageData/${user.email}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        const result = await response.text();
        alert(result); 
        setProfilepic([]); 
      } else if (response.status === 404) {
        alert("User not found with the provided email.");
      } else {
        alert("Failed to delete profile image. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting profile image:", error);
      alert("An error occurred while deleting the profile image.");
    }
  };


  // Function to delete Account
  const deleteAccount = async () => {
    if (!user || !user.email) {
      alert("User data not found. Please log in.");
      return;
    }

    const confirmation = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (!confirmation) return;

    try {
      const response = await fetch(
        `https://localhost:7189/api/SignupDetails/DeleteAccount/${user.email}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        const result = await response.text();
        alert(result); // Show success message
        handleLogoutClick(); // Log out the user and clear data
      } else if (response.status === 404) {
        alert("Account not found.");
      } else {
        alert("Failed to delete account. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("An error occurred while deleting the account.");
    }
  };

  return (
    <div className="app-header">
      <div>
        <Link className="app-logo ms-0">RentalCars</Link>
      </div>
      <button className="hamburger-menu desktop-only-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <i className={`fas ${menuOpen ? "fa-times" : "fa-bars"}`}></i>
      </button>
      <div className={`app-header-links desktop-header-links ${menuOpen ? "open" : ""}`}>
        <Link
          className={`app-header-option ms-0 ${
            location.pathname === "/" ? "active" : ""
          }`}
          onClick={handleClick}
          to="/"
        >
          HOME
        </Link>
        <Link
          className={`app-header-option ${
            location.pathname === "/RentMyCar" ? "active" : ""
          }`}
          onClick={handleClick}
          to="/RentMyCar"
        >
          UPLOAD MY CAR
        </Link>
        {user !== null && (
          <Link
            className={`app-header-option ${
              location.pathname === "/Dashboard" ? "active" : ""
            }`}
            onClick={handleClick}
            to="/Dashboard"
          >
            DASHBOARD
          </Link>
        )}
        {user === null && (
          <>
            <Link
              className={`app-header-option ${
                location.pathname === "/LoginPage" ? "active" : ""
              }`}
              onClick={handleClick}
              to="/LoginPage"
            >
              LOGIN
            </Link>
            <Link
              className={`app-header-option ${
                location.pathname === "/SignupPage" ? "active" : ""
              }`}
              onClick={handleClick}
              to="/SignupPage"
            >
              SIGNUP
            </Link>
          </>
        )}
        {user !== null && (
          <Link
            className={`app-header-option ${
              location.pathname === "/Messages" ? "active" : ""
            }`}
            onClick={handleClick}
            to="/Messages"
          >
            <span style={{ position: "relative", display: "inline-block" }}>
              MESSAGES
              {hasUnread && <span className="header-notification-dot"></span>}
            </span>
          </Link>
        )}
        <Link className="profile" onClick={() => { setShowProfile(!showProfile); setMenuOpen(false); }}>
          PROFILE
        </Link>
      </div>

      {/* Mobile-only Header Actions */}
      {location.pathname === "/" && (
        <div className="mobile-header-actions">
          <button className="mobile-filter-toggle-btn" onClick={handleHamburgerClick}>
            <i className={`fas ${filtersOpen ? "fa-times" : "fa-bars"}`}></i>
          </button>
        </div>
      )}

      {/* Mobile-only Bottom Navigation Bar */}
      <div className="mobile-bottom-nav">
        <Link
          className={`mobile-nav-item ${location.pathname === "/" ? "active" : ""}`}
          onClick={handleClick}
          to="/"
        >
          <i className="fas fa-home"></i>
        </Link>
        <Link
          className={`mobile-nav-item ${location.pathname === "/RentMyCar" ? "active" : ""}`}
          onClick={handleClick}
          to="/RentMyCar"
        >
          <i className="fas fa-plus-square"></i>
        </Link>
        {user !== null && (
          <Link
            className={`mobile-nav-item ${location.pathname === "/Dashboard" ? "active" : ""}`}
            onClick={handleClick}
            to="/Dashboard"
          >
            <i className="fas fa-tachometer-alt"></i>
          </Link>
        )}
        {user === null && (
          <>
            <Link
              className={`mobile-nav-item ${location.pathname === "/LoginPage" ? "active" : ""}`}
              onClick={handleClick}
              to="/LoginPage"
            >
              <i className="fas fa-sign-in-alt"></i>
            </Link>
            <Link
              className={`mobile-nav-item ${location.pathname === "/SignupPage" ? "active" : ""}`}
              onClick={handleClick}
              to="/SignupPage"
            >
              <i className="fas fa-user-plus"></i>
            </Link>
          </>
        )}
        {user !== null && (
          <Link
            className={`mobile-nav-item ${location.pathname === "/Messages" ? "active" : ""}`}
            style={{ position: "relative" }}
            onClick={handleClick}
            to="/Messages"
          >
            <i className="fas fa-paper-plane"></i>
            {hasUnread && <span className="mobile-nav-notification-dot"></span>}
          </Link>
        )}
        <button
          className={`mobile-nav-item profile-nav-item ${showProfile ? "active" : ""}`}
          onClick={() => { setShowProfile(!showProfile); }}
        >
          {profilepic && profilepic.profileImageData ? (
            <img
              src={`data:image/jpeg;base64,${profilepic.profileImageData}`}
              alt="Profile"
              className="mobile-nav-profile-img"
            />
          ) : (
            <i className="fas fa-user-circle"></i>
          )}
        </button>
      </div>

      {showProfile && (
        <div className="profile-popup">
          <div
            className="text-end border-0 profile-closemark"
            onClick={() => setShowProfile(false)}
          >
            ✖
          </div>

          <div>
            <div className="text-white fw-bold">
              {user ? (
                <div className="d-flex flex-column align-items-center">
                  <p className="text-white text-center fw-bold">
                    {user.userName}
                  </p>
                  <div className="d-flex justify-content-center">
                    <div className="profile-pic">
                      {profilepic.profileImageData ? (
                        <div className="profile-pic-container">
                          <div className="profile-pic">
                            <img
                              src={`data:image/jpeg;base64,${profilepic.profileImageData}`}
                              alt="User Profile"
                              style={{ width: "110px", height: "110px" }}
                            />
                            <div
                              className="edit-icon"
                              onClick={() => fileInputRef.current.click()} // Trigger file input on click
                            >
                              ✎
                            </div>
                          </div>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleImageUpload}
                          />
                        </div>
                      ) : (
                        <div className="profile-pic-container">
                          <div className="profile-pic">
                            <img
                              src="/BackgroundImages/nouserprofile.png"
                              alt="User Profile"
                              style={{ width: "110px", height: "110px" }}
                            />
                            <div
                              className="edit-icon"
                              onClick={() => fileInputRef.current.click()} // Trigger file input on click
                            >
                              ✎
                            </div>
                          </div>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleImageUpload}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-white text-center fw-bold">
                    <label>EMAIL: </label>
                    {user.email}
                  </p>

                  <button className="logout-button" onClick={handleLogoutClick}>
                    LOGOUT
                  </button>

                  <div style={{ width: "100%", textAlign: "end" }}>
                    <button
                      className="settings-btn"
                      onClick={handleSettingsToggle}
                    >
                      Settings
                    </button>
                    {showExtendedSettings && (
                      <div className="extended-settings">
                        <button onClick={deleteProfileImage}>
                          Remove Profile Image
                        </button>
                        <button onClick={deleteAccount}>Delete Account</button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="d-flex flex-column align-items-center">
                  <div className="d-flex justify-content-center mt-3">
                    <div className="profile-pic">
                      <img
                        src="/BackgroundImages/nouserprofile.png"
                        alt="User Profile"
                        style={{ width: "110px", height: "110px" }}
                      />
                    </div>
                  </div>
                  <p className="text-white text-center fw-bold">
                    Not yet Signed in
                  </p>
                  <button className="logout-button" onClick={handleLogin}>
                    LOGIN
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Popup */}
      {selectedFile && (
        <div className="popup-overlay">
          <div className="popup">
            <p className="text-white">
              Are you sure you want to change your profile image?
            </p>
            <button className="m-1" onClick={handleSaveImage}>
              Yes
            </button>
            <button className="m-1" onClick={() => setSelectedFile(null)}>
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
