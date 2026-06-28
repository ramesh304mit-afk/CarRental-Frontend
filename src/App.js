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
      
      <video autoPlay muted loop playsInline webkit-playsinline="true" preload="auto" className="background-video">
        <source src="https://www.dropbox.com/scl/fi/on309wkczbomuhal2ea84/BackgroundVideo-1.mp4?rlkey=lni5hib2wmyxdyuvorgppgm2u&st=mtxxz1c5&raw=1" type="video/mp4" />
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