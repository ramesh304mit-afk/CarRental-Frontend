import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styling/LoginPage.css";

export default function LoginPage() {
  const [loginDetails, setLoginDetails] = useState({
    signupEmailID: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginDetails({
      ...loginDetails,
      [name]: value,
    });
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://localhost:7189/api/SignupDetails/Login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginDetails),
        }
      );

      console.log("Request:", loginDetails); // Log the request details

      if (response.ok) {
        const userData = await response.json();
        const userDataString = encodeURIComponent(JSON.stringify(userData));
        console.log(userDataString);
        
        document.cookie = `user=${userDataString}; path=/; max-age=86400`;
        console.log("Cookie set:", document.cookie);
        navigate("/");
      } else {
        const errorText = await response.text();
        setError(`${errorText}`);
        console.log("Error Response:", errorText); // Log the error response
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setError(`An error occurred while logging in: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="loginform-container">
        <div className="p-2 fs-4 fw-bold bg-light text-dark">LOGIN</div>
        <div className="loginform-input-container">
          <div style={{ width: "350px" }}>
            <div className="input-container">
              <input
                className="login-input"
                placeholder=""
                type="email"
                name="signupEmailID"
                value={loginDetails.signupEmailID}
                onChange={handleChange}
                autoComplete="off"
                required
              />
              <label className="text-light floating-label">⭐Email</label>
            </div>
            <div className="input-container">
              <input
                className="login-input"
                placeholder=""
                type="password"
                name="password"
                value={loginDetails.password}
                onChange={handleChange}
                autoComplete="off"
                required
              />
              <label className="text-light floating-label">⭐Password:</label>
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}
            <div className="d-flex justify-content-center">
              <button className="login-button" type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Log In"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
