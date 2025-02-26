import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // Import the AuthContext
import "./Navbar.css";

const Navbar = () => {
  const { isLoggedIn, logout } = useContext(AuthContext); // Get the auth state and logout function
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Call the logout function from AuthContext
    navigate("/"); // Redirect to home page
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <NavLink to="/" className="navbar-logo">
          AnimeDB
        </NavLink>
      </div>
      <ul className="navbar-links">
        <li>
          <NavLink to="/" className="navbar-link" activeClassName="active" exact>
            Home
          </NavLink>
        </li>
        {isLoggedIn ? (
          <>
            <li>
              <NavLink to="/profile" className="navbar-link" activeClassName="active">
                Profile
              </NavLink>
            </li>
            <li>
              <button onClick={handleLogout} className="navbar-button">
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink to="/login" className="navbar-link" activeClassName="active">
                Login
              </NavLink>
            </li>
            <li>
              <NavLink to="/signup" className="navbar-button">
                Signup
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;