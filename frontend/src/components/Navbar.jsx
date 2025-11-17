import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav style={navBar}>
      <div style={leftMenu}>
        <Link style={navLink} to="/">Home</Link>
        <Link style={navLink} to="/manual">Manual</Link>
        <Link style={navLink} to="/image">Image</Link>
        <Link style={navLink} to="/voice">Voice</Link>
        <Link style={navLink} to="/dashboard">Dashboard</Link>
      </div>
    </nav>
  );
};

// ✅ Inline Styles
const navBar = {
  width: "100%",
  background: "#f2f2f2",
  padding: "12px 20px",
  display: "flex",
  alignItems: "center",
  borderBottom: "1px solid #ddd",
  marginBottom: "20px",
};

const leftMenu = {
  display: "flex",
  gap: "25px",
};

const navLink = {
  textDecoration: "none",
  color: "#5a2ca0",
  fontSize: "16px",
  fontWeight: "600",
};

export default Navbar;
