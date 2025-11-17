import React, { useState } from "react";
import axios from "../api/axios";

const ManualComplaint = () => {
  const [name, setName] = useState("");
  const [issue, setIssue] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [loading, setLoading] = useState(false);

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        setLatitude(lat);
        setLongitude(lon);

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
          );
          const data = await res.json();
          setLocation(data.display_name || `Lat: ${lat}, Lon: ${lon}`);
        } catch {
          setLocation(`Lat: ${lat}, Lon: ${lon}`);
        }
      },
      () => alert("Unable to fetch location")
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !issue || !location) {
      alert("All fields required");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/api/complaints/manual", {
        name,
        issue,
        location,
        latitude,
        longitude,
      });

      alert("✅ Complaint submitted!");

      setName("");
      setIssue("");
      setLocation("");
      setLatitude("");
      setLongitude("");
    } catch (err) {
      alert("Failed to submit complaint");
    }
    setLoading(false);
  };

  return (
    <div style={page}>
      <h2 style={title}>📝 Manual Complaint</h2>

      <form onSubmit={handleSubmit} style={card}>
        <label style={label}>Name</label>
        <input style={input} value={name} onChange={(e) => setName(e.target.value)} />

        <label style={label}>Issue</label>
        <textarea
          style={textarea}
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
        />

        <label style={label}>Location</label>
        <input
          style={input}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <button type="button" style={btnBlue} onClick={useMyLocation}>
          📍 Use My Location
        </button>

        <button type="submit" style={btnGreen}>
          {loading ? "Submitting..." : "Submit Complaint"}
        </button>
      </form>
    </div>
  );
};

// ---------- INLINE STYLES ----------
const page = { maxWidth: "600px", margin: "20px auto", padding: "10px" };
const title = { fontSize: "22px", fontWeight: "bold", marginBottom: "12px" };
const card = {
  background: "#fff",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};
const label = { fontWeight: "600" };
const input = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  width: "100%",
};
const textarea = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  width: "100%",
  minHeight: "90px",
};
const btnBlue = {
  background: "#007BFF",
  color: "white",
  padding: "10px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};
const btnGreen = {
  background: "green",
  color: "white",
  padding: "12px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

export default ManualComplaint;
