import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "./Button";
import "./Navbar.css";

import HomeIcon from "../../assets/home-icon.png";
import LoginIcon from "../../assets/login-icon.png";
import SignupIcon from "../../assets/signup-icon.png";
import LogoutIcon from "../../assets/logout-icon.png";

function Navbar() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar glassmorphic">
      <Link to="/" className="logo cartoonish-text">
        Loca.Live
      </Link>
      <div className="nav-links">
        {token ? (
          <>
            <Link to="/" className="nav-item" title="Home">
              <img src={HomeIcon} alt="Home" className="nav-icon" />
            </Link>
            <Button
              onClick={handleLogout}
              className="nav-button neuromorphic-button"
            >
              <img src={LogoutIcon} alt="Logout" className="nav-icon" />
            </Button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-item" title="Login">
              <img src={LoginIcon} alt="Login" className="nav-icon" />
            </Link>
            <Link to="/signup" className="nav-item" title="Sign Up">
              <img src={SignupIcon} alt="Sign Up" className="nav-icon" />
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
