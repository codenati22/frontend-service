import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../utils/api";
import { useApiError, ErrorDisplay } from "../utils/errorHandler";
import Button from "../components/common/Button";
import "./Login.css";

function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const { error, handleError } = useApiError();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login(credentials);
      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <main className="login-page fade-in">
      <div className="form-container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={credentials.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
            required
          />
          <Button type="submit">Login</Button>
        </form>
        <p>
          Don’t have an account? <a href="/signup">Sign up</a>
        </p>
        <ErrorDisplay error={error} />
      </div>
    </main>
  );
}

export default Login;
