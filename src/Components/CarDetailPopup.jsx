import React, { useContext, useState, useEffect, useRef } from "react";
import "../Styling/CarDetailPopup.css";
import { CarContext } from "./StateManagement";
import { useChat } from "./ChatContext";
import { useNavigate } from "react-router-dom";

export default function CarDetailPopup() {
  const { user, messages, sendMessage, setActiveChatRecipient } = useChat();
  const { selectedCar, setSelectedCar } = useContext(CarContext);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("details");

  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  useEffect(() => {
    if (selectedCar) {
      setActiveTab("details");
    }
  }, [selectedCar]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    
    // Ignore swipe transitions if focused on typing input
    if (document.activeElement && document.activeElement.tagName === "INPUT") {
      return;
    }

    const diffX = touchStartX.current - touchEndX.current;
    if (diffX > 50) {
      // Swiped left -> show chat
      setActiveTab("chat");
    } else if (diffX < -50) {
      // Swiped right -> show details
      setActiveTab("details");
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const [inputValue, setInputValue] = useState("");
  const [lastMessages, setLastMessages] = useState({});

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const renderMessageContent = (message) => {
    if (message.startsWith("CAR_CARD_JSON:")) {
      try {
        const carInfo = JSON.parse(message.substring("CAR_CARD_JSON:".length));
        return (
          <div className="chat-car-card">
            <div className="chat-car-card-image-container">
              <img className="chat-car-card-img" src={`data:image/png;base64,${carInfo.imageData}`} alt="" />
              <div className="chat-car-card-price-badge">Rs. {carInfo.rentalPrice}/day</div>
            </div>
            <div className="chat-car-card-details">
              <div className="chat-car-card-title">{carInfo.brand} {carInfo.carName}</div>
              <div className="chat-car-card-specs">
                <span className="spec-item"><i className="fas fa-calendar-alt"></i> {carInfo.modelYear}</span>
                <span className="spec-divider">•</span>
                <span className="spec-item"><i className="fas fa-check-circle text-warning"></i> Available</span>
              </div>
            </div>
          </div>
        );
      } catch (e) {
        console.error("Failed to parse car card message: ", e);
      }
    }
    return message;
  };

  const renderTicks = (msg) => {
    if (!user || msg.sender !== user.email) return null;
    if (msg.status === "read") {
      return <i className="fas fa-check-double" style={{ color: "#53bdeb", marginLeft: "5px", fontSize: "10px" }}></i>;
    } else if (msg.status === "delivered") {
      return <i className="fas fa-check-double" style={{ color: "#888", marginLeft: "5px", fontSize: "10px" }}></i>;
    } else {
      return <i className="fas fa-check" style={{ color: "#888", marginLeft: "5px", fontSize: "10px" }}></i>;
    }
  };

  const [error, setError] = useState(null);
  const [profilepic, setProfilepic] = useState([]);

  useEffect(() => {
    if (selectedCar && activeTab === "chat") {
      setActiveChatRecipient(selectedCar.signupEmailID);
    } else {
      setActiveChatRecipient(null);
    }
    return () => {
      setActiveChatRecipient(null);
    };
  }, [selectedCar, activeTab, setActiveChatRecipient]);

  useEffect(() => {
    const fetchImages = async () => {
      if (!user) {
        setError("User email not found");
        return;
      }

      try {
        const response = await fetch(
          `https://carrental-backend-9bti.onrender.com/api/SignupDetails/GetProfileImageData/${selectedCar.signupEmailID}`
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
    if (user && selectedCar) {
      fetchImages();
    }
  }, [selectedCar, user]);

  const Closecardetailpopup = () => {
    setSelectedCar(null);
  };

  const Closepopup = () => {
    setShowPopup(false);
  };

  const handleInputChange = (event) => {
    if (!user) {
      setShowPopup(true);
    } else {
      setInputValue(event.target.value);
    }
  };

  const handleInputClick = () => {
    if (!user) {
      setShowPopup(true);
    }
  };

  const handleSend = async () => {
    if (!user) {
      setShowPopup(true);
      return;
    }
    try {
      const timestamp = new Date().toISOString();
      const hasSentThisCarCard = filteredMessages.some((msg) => {
        if (msg.message.startsWith("CAR_CARD_JSON:")) {
          try {
            const carInfo = JSON.parse(msg.message.substring("CAR_CARD_JSON:".length));
            return carInfo.id === selectedCar.id || 
              (carInfo.brand === selectedCar.brand && 
               carInfo.carName === selectedCar.carName && 
               carInfo.modelYear === selectedCar.modelYear);
          } catch (e) {
            return false;
          }
        }
        return false;
      });

      if (!hasSentThisCarCard) {
        const carDetailsMsg = `CAR_CARD_JSON:${JSON.stringify({
          id: selectedCar.id,
          brand: selectedCar.brand,
          carName: selectedCar.carName,
          modelYear: selectedCar.modelYear,
          rentalPrice: selectedCar.rentalPrice,
          imageData: selectedCar.imageData
        })}`;
        await sendMessage(selectedCar.signupEmailID, carDetailsMsg);
      }

      await sendMessage(selectedCar.signupEmailID, inputValue);

      setLastMessages((prevLastMessages) => ({
        ...prevLastMessages,
        [selectedCar.signupEmailID]: { message: inputValue, timestamp },
      }));

      setInputValue("");
    } catch (e) {
      console.error("Send message failed: ", e);
      alert(e.message);
    }
  };

  if (!selectedCar) {
    return null;
  }

  // Show only the conversation relevant to this car's owner
  const filteredMessages = user
    ? messages.filter(
        (msg) =>
          (msg.sender === user.email && msg.recipient === selectedCar.signupEmailID) ||
          (msg.sender === selectedCar.signupEmailID && msg.recipient === user.email)
      )
    : [];

  return (
    <>
      <div className="cardetailpopupbackground">
        <div 
          className="cardetailpopup-container row p-0 m-0"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <button className="close-mark" onClick={Closecardetailpopup}>
            &times;
          </button>

          {/* Mobile Carousel Tab Indicators */}
          <div className="mobile-carousel-tabs d-lg-none">
            <button
              className={`mobile-tab-btn ${activeTab === "details" ? "active" : ""}`}
              onClick={() => setActiveTab("details")}
            >
              DETAILS
            </button>
            <button
              className={`mobile-tab-btn ${activeTab === "chat" ? "active" : ""}`}
              onClick={() => setActiveTab("chat")}
            >
              MESSAGE OWNER
            </button>
          </div>

          <div className={`col-lg-6 col-12 text-white d-flex flex-column p-0 overflow-hidden mobile-tab-pane ${activeTab === "details" ? "active" : "inactive"}`}>
            <div
              id="carouselExampleIndicators"
              className="carousel slide"
              data-bs-ride="carousel"
            >
              <div className="carousel-indicators">
                <button
                  type="button"
                  data-bs-target="#carouselExampleIndicators"
                  data-bs-slide-to="0"
                  className="active"
                  aria-current="true"
                  aria-label="Slide 1"
                ></button>
                <button
                  type="button"
                  data-bs-target="#carouselExampleIndicators"
                  data-bs-slide-to="1"
                  aria-label="Slide 2"
                ></button>
                <button
                  type="button"
                  data-bs-target="#carouselExampleIndicators"
                  data-bs-slide-to="2"
                  aria-label="Slide 3"
                ></button>
              </div>
              <div className="carousel-inner">
                <div
                  className="carousel-item active"
                  style={{ width: "450px", height: "253px" }}
                >
                  <img
                    className="d-block w-100"
                    src={`data:image/png;base64,${selectedCar.imageData}`}
                    alt=""
                  />
                </div>
                <div
                  className="carousel-item"
                  style={{ width: "450px", height: "253px" }}
                >
                  <img
                    className="d-block w-100"
                    src="/BackgroundImages/noimage.jpg"
                    alt=""
                  />
                </div>
                <div
                  className="carousel-item"
                  style={{ width: "450px", height: "253px" }}
                >
                  <img
                    className="d-block w-100"
                    src="/BackgroundImages/noimage.jpg"
                    alt=""
                  />
                </div>
              </div>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide="prev"
              >
                <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide="next"
              >
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
            <div className="d-flex">
              <div className="p-2 fw-bold fs-5">
                <p>Brand</p>
                <p>Car Name</p>
                <p>Model Year</p>
                <p>Transmission</p>
                <p>Fuel Type</p>
                <p>Car Type</p>
                <p>Seats</p>
                <p>Price</p>
              </div>
              <div className="p-2 fw-bold fs-5">
                <p>: {selectedCar.brand}</p>
                <p>: {selectedCar.carName}</p>
                <p>: {selectedCar.modelYear}</p>
                <p>: {selectedCar.transmission}</p>
                <p>: {selectedCar.fuelType}</p>
                <p>: {selectedCar.carType}</p>
                <p>: {selectedCar.seats} Seater</p>
                <p>: {selectedCar.rentalPrice}/day</p>
              </div>
            </div>
          </div>
          <div className={`col-lg-6 col-12 text-white d-flex justify-content-center overflow-hidden mobile-tab-pane chat-pane ${activeTab === "chat" ? "active" : "inactive"}`}>
            <div className="message-box" style={{ position: "relative" }}>
              <img
                className="message-background"
                src="/BackgroundImages/whatsapp background.jpg"
                alt=""
              />
              {/* User Profile Information */}
              <div className="userchat-info">
                <div className="userchat-avatar">
                  {profilepic.profileImageData ? (
                    <img
                      src={`data:image/jpeg;base64,${profilepic.profileImageData}`}
                      alt="User"
                      style={{ width: "40px", height: "40px", borderRadius: "100%" }}
                    />
                  ) : (
                    <img
                      src="/BackgroundImages/nouserprofile.png"
                      alt="User Profile"
                      style={{ width: "40px", height: "40px", borderRadius: "100%" }}
                    />
                  )}
                </div>
                <span className="user-name">{selectedCar.signupEmailID}</span>
              </div>
              <div className="message-content p-0">
                {/* Messages */}
                {filteredMessages.map((msg, index) => {
                  const isCarCard = msg.message.startsWith("CAR_CARD_JSON:");
                  return (
                    <div
                      key={index}
                      className={`message-bubble ${
                        user && msg.sender === user.email ? "sent" : "received"
                      } ${isCarCard ? "car-card-bubble" : ""}`}
                    >
                      {renderMessageContent(msg.message)}
                      {!isCarCard && (
                        <div className="message-time">
                          {formatTimestamp(msg.timestamp)}
                          {renderTicks(msg)}
                        </div>
                      )}
                      {isCarCard && (
                        <div className="message-time car-card-time" style={{ padding: "0 8px 4px 0", textAlign: "right" }}>
                          {formatTimestamp(msg.timestamp)}
                          {renderTicks(msg)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {user == null ? (
                <div className="chat-container">
                  <input
                    type="text"
                    className="whatsapp-input"
                    placeholder="Type a message"
                    value={inputValue}
                    onChange={handleInputChange}
                    onClick={handleInputClick}
                  />
                  <button
                    className="send-button"
                    onClick={handleSend}
                    disabled={!inputValue.trim()}
                  >
                    &#10148;
                  </button>
                </div>
              ) : user.email === selectedCar.signupEmailID ? (
                <div className="your-car-message">
                  <p className="text-white">YOUR CAR</p>
                </div>
              ) : (
                <div className="chat-container">
                  <input
                    type="text"
                    className="whatsapp-input"
                    placeholder="Type a message"
                    value={inputValue}
                    onChange={handleInputChange}
                    onClick={handleInputClick}
                  />
                  <button
                    className="send-button"
                    onClick={handleSend}
                    disabled={!inputValue.trim()}
                  >
                    &#10148;
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <p className="text-white">Please login</p>
            <button className="" onClick={() => navigate("/LoginPage")}>
              Login
            </button>
            <p className="text-white">
              Don't have an account?{" "}
              <span
                onClick={() => navigate("/SignupPage")}
                style={{
                  cursor: "pointer",
                  textDecoration: "underline",
                  color: "lightblue",
                }}
              >
                Signup
              </span>
            </p>
            <div className="d-flex">
              <button
                className="text-start text-warning mb-0 bg-transparent"
                onClick={Closepopup}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
