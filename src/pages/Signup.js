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
  const { error, handleError } = useApiError();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await signup(userData);
      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <main className="signup-page fade-in">
      <div className="form-container">
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={userData.username}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={userData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={userData.password}
            onChange={handleChange}
            required
          />
          <Button type="submit">Sign Up</Button>
        </form>
        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
        <ErrorDisplay error={error} />
      </div>
    </main>
  );
}

export default Signup;
