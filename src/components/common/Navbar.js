import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "./Button";
import "./Navbar.css";

function Navbar() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        StreamApp
      </Link>
      <div className="nav-links">
        {token ? (
          <>
            <Link to="/" className="start-stream">
              + Start Stream
            </Link>
            <Button onClick={handleLogout}>Logout</Button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
