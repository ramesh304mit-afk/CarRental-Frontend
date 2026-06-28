import { BrowserRouter, Route, Routes } from "react-router-dom";
import React from "react";
import "./App.css";
import Header from "./Components/Header";
import Homepage from "./Components/Homepage";
import RentOutMyCar from "./Components/RentOutMyCar";
import UserDashboard from "./Components/UserDashboard";
import SignupPage from "./Components/SignupPage";
import LoginPage from "./Components/LoginPage";
import Messages from "./Components/Messages";
import { ChatProvider } from "./Components/ChatContext";

function App() {
  return ( 
    <div className="background-video-container">
      
      <video autoPlay muted loop className="background-video">
        <source src="https://docs.google.com/uc?export=download&confirm=no_antivirus&id=1VrWIKYUW9tpjAQIoB9fmD2FvxzFtx2PE" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <BrowserRouter>
        <ChatProvider>
          <Header />

          <Routes>
            <Route path="/" element={<Homepage />}>
              HOME
            </Route>
            <Route path="/RentmyCar" element={<RentOutMyCar />}>
              Upload My Car
            </Route>
            <Route path="/Dashboard" element={<UserDashboard />}>
              Dashboard
            </Route>
            <Route path="/SignupPage" element={<SignupPage />}>
              Signup
            </Route>
            <Route path="/LoginPage" element={<LoginPage />}>
              Signup
            </Route>
            <Route path="/Messages" element={<Messages/>}>
              Messages
            </Route>
          </Routes>
        </ChatProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;