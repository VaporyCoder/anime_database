import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <NavLink to="/" className="navbar-logo">
          <span className="logo-text">Anime</span>
          <span className="logo-highlight">Nexus</span>
        </NavLink>

        {/* Main Navigation */}
        <div className={`nav-links ${isMenuOpen ? "active" : ""}`}>
          <NavLink 
            to="/anime"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            Anime
          </NavLink>
          <NavLink 
            to="/manga"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            Manga
          </NavLink>
          <div className="nav-dropdown">
            <button className="dropdown-toggle">
              Categories
              <span className="dropdown-arrow">▼</span>
            </button>
            <div className="dropdown-menu">
              <NavLink to="/genres" className="dropdown-item">Genres</NavLink>
              <NavLink to="/seasonal" className="dropdown-item">Seasonal</NavLink>
              <NavLink to="/top-rated" className="dropdown-item">Top Rated</NavLink>
            </div>
          </div>
        </div>

        {/* Auth Section */}
        <div className="auth-section">
          {isLoggedIn ? (
            <>
              <NavLink to="/profile" className="profile-button">
                <span className="profile-icon">👤</span>
                Profile
              </NavLink>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="auth-button">
                Login
              </NavLink>
              <NavLink to="/signup" className="auth-button signup-button">
                Sign Up
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <div className={`hamburger ${isMenuOpen ? "open" : ""}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;