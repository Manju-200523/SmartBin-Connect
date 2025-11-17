import React from "react";
import { Link } from "react-router-dom";
import "../pages/Home.css"; // make sure this path matches your folder

const Home = () => {
  return (
    <div className="home-container">
      <h1 className="home-title">SmartBin Connect</h1>
      <p className="home-subtitle">Report waste issues quickly & easily</p>

      <div className="home-buttons">
        <Link to="/manual" className="home-btn manual-btn">
          📝 Manual Complaint
        </Link>

        <Link to="/voice" className="home-btn voice-btn">
          🎤 Voice Complaint
        </Link>

        <Link to="/image" className="home-btn image-btn">
          📷 Image Complaint
        </Link>
      </div>
    </div>
  );
};

export default Home;
