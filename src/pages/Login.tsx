import React, { useEffect, useState } from "react";
import "../assets/styles/Login.css"; // Importing your CSS styles
import { useNavigate, useParams } from "react-router-dom";
// import { setUserDetails } from "../util/ApiClient";
import axios from "axios";
import { API_URL } from "../config";

export const Login = () => {
  const [userEmail, setUserEmail] = useState(""); // State for userEmail
  const [password, setPassword] = useState(""); // State for password
  const [error, setError] = useState(""); // State for error messages
  const [loading, setLoading] = useState(false); // State for loading indicator

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/quiz");
    }
  }, []);

  const login = (userEmail: string, userPassword: string) => {
    return axios.post(`${API_URL}/admin/login`, {
      userEmail,
      userPassword,
      isAdmin: true,
    });
  };

  // Form submission handler
  const handleSubmit = async (event: any) => {
    event.preventDefault(); // Prevent page reload on form submit

    if (!userEmail || !password) {
      setError("Please enter userEmail and password");
      return;
    }

    setError(""); // Clear error if fields are valid
    setLoading(true); // Show loading indicator

    try {
      const { data } = await login(userEmail, password);
      localStorage.setItem("token", data?.token);
      console.log(data);
      setLoading(false);
      setUserEmail("");
      setPassword("");
      setError("");
      navigate("/quiz");
    } catch (e) {
      console.log(e);
      setLoading(false);
      setError("Invalid userEmail or password");
      return;
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="userEmail">Email</label>
            <input
              type="text"
              id="userEmail"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="Enter userid"
              autoComplete="off" // Disabling browser autocomplete
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};
