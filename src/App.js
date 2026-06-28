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
import { CarProvider } from "./Components/StateManagement";

function App() {
  return ( 
    <div className="background-video-container">
      
      <video autoPlay muted loop className="background-video">
        <source src="https://www.dropbox.com/scl/fi/c8a1guzdk6mw9ez42uuok/BackgroundVideo.mp4?rlkey=hptj6alrbw1366456p01w49ik&st=0cmoli1s&raw=1" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <BrowserRouter>
        <CarProvider>
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
        </CarProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;