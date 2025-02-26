// src/components/Navbar.js
import React from "react";

const Navbar = () => {
  return (
    <nav>
      <h1>Anime Website</h1>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/anime">Anime</a></li>
        <li><a href="/profile">Profile</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;