import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../utils/api";
import { useApiError, ErrorDisplay } from "../utils/errorHandler";
import Button from "../components/common/Button";
import "./Signup.css";

function Signup() {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { error, handleError } = useApiError();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await signup(userData);
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("username", data.user.username);
      console.log("Signed up:", {
        token: data.token,
        userId: data.user.id,
        username: data.user.username,
      });
      navigate("/");
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="signup-page fade-in">
      <div className="form-container glassmorphic">
        <h1 className="cartoonish-title">Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={userData.username}
            onChange={handleChange}
            required
            className="glassmorphic-input"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={userData.email}
            onChange={handleChange}
            required
            className="glassmorphic-input"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={userData.password}
            onChange={handleChange}
            required
            className="glassmorphic-input"
          />
          <Button
            type="submit"
            className="neuromorphic-button"
            disabled={isLoading}
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </Button>
        </form>
        <p className="cartoonish-text">
          Already have an account? <a href="/login">Login</a>
        </p>
        <ErrorDisplay error={error} />
      </div>
    </main>
  );
}

export default Signup;
