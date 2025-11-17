import React, { useState } from "react";
import axios from "../api/axios";

const ImageComplaint = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [issue, setIssue] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    location: "",
    latitude: "",
    longitude: "",
  });

  const useMyLocation = () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      setForm((f) => ({ ...f, latitude: lat, longitude: lon }));

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
        );
        const data = await res.json();

        setForm((f) => ({
          ...f,
          location: data.display_name || `Lat:${lat}, Lon:${lon}`,
        }));
      } catch {
        setForm((f) => ({ ...f, location: `Lat:${lat}, Lon:${lon}` }));
      }
    });
  };

  const detectIssue = async () => {
    if (!image) return alert("Upload an image");

    const formData = new FormData();
    formData.append("image", image);

    setLoading(true);

    try {
      const res = await axios.post("/api/complaints/detect-image", formData);
      setIssue(res.data.issue || "Unknown");
    } catch (err) {
      setIssue("Detection failed");
    }

    setLoading(false);
  };

  const submitFinal = async () => {
    if (!image) return alert("Upload image first");
    if (!issue) return alert("Detect issue first");

    const fd = new FormData();
    fd.append("image", image);
    fd.append("issue", issue);
    fd.append("name", form.name);
    fd.append("location", form.location);
    fd.append("latitude", form.latitude);
    fd.append("longitude", form.longitude);

    await axios.post("/api/complaints/image", fd);
    alert("✅ Image complaint submitted!");
  };

  return (
    <div style={page}>
      <h2 style={title}>🖼 Image Complaint</h2>

      <div style={card}>
        <input
          type="file"
          onChange={(e) => {
            setImage(e.target.files[0]);
            setPreview(URL.createObjectURL(e.target.files[0]));
          }}
        />

        {preview && <img src={preview} style={img} alt="preview" />}

        <button style={btnBlue} onClick={detectIssue}>
          {loading ? "Detecting..." : "Detect Issue"}
        </button>

        <p>
          <b>Detected Issue:</b> {issue}
        </p>

        <label>Name</label>
        <input
          style={input}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <label>Location</label>
        <input
          style={input}
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />

        <button style={btnBlue} onClick={useMyLocation}>
          📍 Use My Location
        </button>

        <button style={btnGreen} onClick={submitFinal}>
          Submit Complaint
        </button>
      </div>
    </div>
  );
};

// INLINE STYLES
const page = { maxWidth: "600px", margin: "20px auto", padding: "10px" };
const title = { fontSize: "22px", fontWeight: "bold", marginBottom: "12px" };
const card = {
  background: "#fff",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};
const input = {
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "8px",
};
const img = { width: "100%", borderRadius: "8px", marginTop: "10px" };
const btnBlue = {
  background: "#007BFF",
  color: "white",
  padding: "10px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
};
const btnGreen = {
  background: "green",
  color: "white",
  padding: "12px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
};

export default ImageComplaint;
