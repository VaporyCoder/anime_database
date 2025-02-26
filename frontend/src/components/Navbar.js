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
      {/* Logo on the far left */}
      <div className="navbar-brand">
        <NavLink to="/" className="navbar-logo">
          AnimeDB
        </NavLink>
      </div>

      {/* Home link in the center */}
      <div className="navbar-home">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "navbar-link active" : "navbar-link"
          }
          end
        >
          Home
        </NavLink>
      </div>

      {/* Auth links on the far right */}
      <ul className="navbar-links">
        {isLoggedIn ? (
          // If logged in, show profile and logout links
          <>
            <li>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive ? "navbar-link active" : "navbar-link"
                }
              >
                Profile
              </NavLink>
            </li>
            <li>
              <button onClick={handleLogout} className="navbar-link">
                Logout
              </button>
            </li>
          </>
        ) : (
          // If not logged in, show login and signup links
          <>
            <li>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? "navbar-link active" : "navbar-link"
                }
              >
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