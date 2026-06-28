import React, { createContext, useState, useEffect, useRef, useContext } from "react";
import * as signalR from "@microsoft/signalr";

export const ChatContext = createContext();

// Helper so any component can grab the same cookie-reading logic
const getCookieValue = (name) => {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
};

export const ChatProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [activeChatRecipient, setActiveChatRecipient] = useState(null);
  const [activeUsers, setActiveUsers] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState({});
  const [lastMessages, setLastMessages] = useState({});
  const connectionRef = useRef(null);
  const connectionEstablished = useRef(false);

  // Load the logged-in user once on mount
  useEffect(() => {
    const userDataString = getCookieValue("user");
    if (userDataString) {
      const parsedData = JSON.parse(userDataString);
      setUser(parsedData);
    }
  }, []);

  // Create exactly ONE connection per logged-in user, and clean it up properly
  useEffect(() => {
    if (!user || !user.email) {
      console.log("No user logged in.");
      return;
    }

    // Guard against creating a second connection if this effect re-runs
    // (e.g. React StrictMode double-invoke in development)
    if (connectionRef.current) {
      return;
    }

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`https://carrental-backend-9bti.onrender.com/chathub?email=${user.email}`)
      .withAutomaticReconnect()
      .build();

    connectionRef.current = newConnection;
    setConnection(newConnection);

    newConnection
      .start()
      .then(() => {
        console.log(`Connected as ${user.userName}`);

        newConnection.on("ReceiveMessage", (sender, message, recipient, status) => {
          const timestamp = new Date().toISOString();
          setMessages((prevMessages) => [
            ...prevMessages,
            { sender, recipient, message, timestamp, status: status || "sent" },
          ]);

          setLastMessages((prevLastMessages) => ({
            ...prevLastMessages,
            [sender]: { message, timestamp },
          }));

          if (recipient === user.email && sender !== user.email) {
            setUnreadMessages((prevUnreadMessages) => ({
              ...prevUnreadMessages,
              [sender]: (prevUnreadMessages[sender] || 0) + 1,
            }));
          }
        });

        newConnection.on("MessagesRead", (reader, sender) => {
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.sender === sender && msg.recipient === reader
                ? { ...msg, status: "read" }
                : msg
            )
          );
        });

        newConnection.on("UpdateActiveUsers", (users) => {
          const filteredUsers = users.filter(
            (activeUser) => activeUser !== user.email
          );
          setActiveUsers(filteredUsers);
        });

        connectionEstablished.current = true;
      })
      .catch((e) => console.error("Connection failed:", e));

    // Cleanup: stop the connection if the provider ever unmounts
    // (e.g. full app teardown, not just navigating between pages)
    return () => {
      newConnection.stop();
      connectionRef.current = null;
      connectionEstablished.current = false;
    };
  }, [user]);

  useEffect(() => {
    if (connection && connection.state === signalR.HubConnectionState.Connected && user) {
      connection.send("JoinChat", user.email, activeChatRecipient || "")
        .catch((err) => console.error("Error sending JoinChat:", err));
    }
  }, [activeChatRecipient, connection, user]);

  const sendMessage = async (recipient, inputValue) => {
    if (!connection || connection.state !== signalR.HubConnectionState.Connected) {
      throw new Error("No connection to the server.");
    }
    if (!recipient) {
      throw new Error("No recipient specified.");
    }

    const timestamp = new Date().toISOString();
    await connection.send("SendMessage", user.email, recipient, inputValue);

    setLastMessages((prevLastMessages) => ({
      ...prevLastMessages,
      [recipient]: { message: inputValue, timestamp },
    }));
  };

  const clearUnread = (email) => {
    setUnreadMessages((prevUnreadMessages) => ({
      ...prevUnreadMessages,
      [email]: 0,
    }));
  };

  return (
    <ChatContext.Provider
      value={{
        user,
        connection,
        messages,
        activeUsers,
        unreadMessages,
        lastMessages,
        sendMessage,
        clearUnread,
        activeChatRecipient,
        setActiveChatRecipient,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// Convenience hook so consuming components don't repeat useContext(ChatContext)
export const useChat = () => useContext(ChatContext);
