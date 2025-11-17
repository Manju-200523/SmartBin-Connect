import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import ManualComplaint from "./pages/ManualComplaint";
import ImageComplaint from "./pages/ImageComplaint";
import VoiceComplaint from "./pages/VoiceComplaint";
import Dashboard from "./pages/Dashboard";

// Components
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/manual" element={<ManualComplaint />} />
        <Route path="/image" element={<ImageComplaint />} />
        <Route path="/voice" element={<VoiceComplaint />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
