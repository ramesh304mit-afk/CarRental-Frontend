import React, { useState } from "react";
import "../Styling/Message.css";
import { useChat } from "./ChatContext";

export default function Messages() {
  const {
    user,
    messages,
    activeUsers,
    unreadMessages,
    lastMessages,
    sendMessage,
    clearUnread,
    setActiveChatRecipient,
  } = useChat();

  const [inputValue, setInputValue] = useState("");
  const [recipient, setRecipient] = useState("");
  const [profilepic, setProfilepic] = useState([]);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    setActiveChatRecipient(recipient);
    return () => {
      setActiveChatRecipient(null);
    };
  }, [recipient, setActiveChatRecipient]);

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

  // Fetch profile pictures for currently active users
  React.useEffect(() => {
    const fetchImages = async () => {
      if (!activeUsers || activeUsers.length === 0) {
        setError("Active users not found");
        return;
      }

      try {
        const fetchedData = await Promise.all(
          activeUsers.map(async (email) => {
            const response = await fetch(
              `https://carrental-backend-9bti.onrender.com/api/SignupDetails/GetProfileImageData/${email}`
            );
            if (response.ok) {
              const data = await response.json();
              return { email, profilePic: data.profileImageData || null };
            } else {
              console.error(`Profile image not found for ${email}`);
              return { email, profilePic: null };
            }
          })
        );
        setProfilepic(fetchedData);
      } catch (error) {
        console.error("Error fetching profile images:", error);
        setError("Error fetching profile images");
      }
    };

    fetchImages();
  }, [activeUsers]);

  const handleSend = async () => {
    if (!recipient) {
      alert("Please select a recipient.");
      return;
    }
    try {
      await sendMessage(recipient, inputValue);
      setInputValue("");
    } catch (e) {
      alert(e.message);
      console.error("Failed to send message:", e);
    }
  };

  const filteredMessages = messages.filter(
    (msg) =>
      (msg.sender === user.email && msg.recipient === recipient) ||
      (msg.sender === recipient && msg.recipient === user.email)
  );

  const getProfilePicForUser = (email) => {
    const userProfile = profilepic.find((pic) => pic.email === email);
    const profile = userProfile?.profilePic;

    if (profile && profile.trim()) {
      return `data:image/jpeg;base64,${profile}`;
    }

    return "/BackgroundImages/nouserprofile.png";
  };

  const handleUserClick = (activeUser) => {
    setRecipient(activeUser);
    clearUnread(activeUser);
  };

  return (
    <div className="message-container row p-0 m-0">
      {/* Active Users List */}
      <div className={`col-lg-6 col-12 text-white d-flex flex-column p-0 overflow-hidden ${recipient ? "mobile-hide" : ""}`}>
        <div className="active-users">
          <h4 className="m-3">Chats</h4>
          {activeUsers.length > 0 ? (
            activeUsers
              .sort((a, b) => {
                if (unreadMessages[a] && !unreadMessages[b]) return -1;
                if (!unreadMessages[a] && unreadMessages[b]) return 1;
                return 0;
              })
              .map((activeUser, index) => (
                <div
                  key={index}
                  className={`active-user ${
                    recipient === activeUser ? "selected-recipient" : ""
                  }`}
                  onClick={() => handleUserClick(activeUser)}
                >
                  <div className="user-avatar-container">
                    <img
                      className="user-avatar"
                      src={getProfilePicForUser(activeUser)}
                      style={{ width: "50px", height: "50px" }}
                      alt="pro"
                    />
                  </div>
                  <div className="user-info">
                    <div className="user-name">
                      <div>{activeUser}</div>
                      <span className="user-last-message">
                        {lastMessages[activeUser]?.message || "No messages yet"}
                      </span>
                    </div>
                    <div className="time-status-container">
                      <div style={{ fontSize: "12px" }}>
                        {lastMessages[activeUser]?.timestamp
                          ? formatTimestamp(lastMessages[activeUser].timestamp)
                          : ""}
                      </div>
                      <div style={{ height: "20px" }}>
                        {unreadMessages[activeUser] > 0 && (
                          <div className="notification-indicator">
                            {unreadMessages[activeUser]}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <p className="text-center">No active users.</p>
          )}
        </div>
      </div>

      {/* Chat Box */}
      <div className={`col-lg-6 col-12 text-white d-flex justify-content-center overflow-hidden p-0 ${!recipient ? "mobile-hide" : ""}`}>
        {recipient ? (
          <div className="message-box" style={{ position: "relative" }}>
            <img
              src="/BackgroundImages/whatsapp background.jpg"
              alt=""
              className="background-image"
            />
            <div className="userchat-info">
              <button className="mobile-back-btn" onClick={() => setRecipient("")}>
                &#8592;
              </button>
              <img
                className="userchat-avatar"
                src={getProfilePicForUser(recipient)}
                alt="User Avatar"
              />
              <span className="user-name">{recipient}</span>
            </div>

            <div className="message-content p-0">
              {filteredMessages.map((msg, index) => {
                const isCarCard = msg.message.startsWith("CAR_CARD_JSON:");
                return (
                  <div
                    key={index}
                    className={`message-bubble ${
                      msg.sender === user.email ? "sent" : "received"
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

            <div className="chat-container">
              <input
                type="text"
                className="whatsapp-input"
                placeholder="Type a message"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button
                className="send-button"
                onClick={handleSend}
                disabled={!inputValue.trim()}
              >
                &#10148;
              </button>
            </div>
          </div>
        ) : (
          <div className="no-recipient-selected">
            <h5>Select a chat to start messaging</h5>
          </div>
        )}
      </div>
    </div>
  );
}
