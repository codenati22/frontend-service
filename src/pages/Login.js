import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../utils/api";
import { useApiError, ErrorDisplay } from "../utils/errorHandler";
import Button from "../components/common/Button";
import "./Login.css";

function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const { error, handleError } = useApiError();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await login(credentials);
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("username", data.user.username);
      console.log("Logged in:", {
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
    <main className="login-page fade-in">
      <div className="form-container glassmorphic">
        <h1 className="cartoonish-title">Login</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={credentials.email}
            onChange={handleChange}
            required
            className="glassmorphic-input"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
            required
            className="glassmorphic-input"
          />
          <Button
            type="submit"
            className="neuromorphic-button"
            disabled={isLoading}
          >
            {isLoading ? "Logging In..." : "Login"}
          </Button>
        </form>
        <p className="cartoonish-text">
          Don’t have an account? <a href="/signup">Sign up</a>
        </p>
        <ErrorDisplay error={error} />
      </div>
    </main>
  );
}

export default Login;
