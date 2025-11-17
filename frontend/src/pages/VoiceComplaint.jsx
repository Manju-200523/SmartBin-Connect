import React, { useState, useRef } from "react";
import { submitVoiceComplaint } from "../api/complaints";

const VoiceComplaint = () => {
  const [form, setForm] = useState({
    name: "",
    issue: "",
    location: "",
    latitude: "",
    longitude: "",
  });

  const [status, setStatus] = useState("");
  const recognitionRef = useRef(null);

  // ✅ Initialize Speech Recognition
  const initSpeech = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setStatus("Speech not supported on your device");
      return null;
    }

    const recog = new SpeechRecognition();
    recog.continuous = true;
    recog.interimResults = true;
    recog.lang = "en-IN";
    return recog;
  };

  // ✅ Get Location IMMEDIATELY when Start Voice is clicked
  const getLocationInstant = () => {
    if (!navigator.geolocation) {
      setStatus("Geolocation not supported");
      return;
    }

    setStatus("📍 Getting location...");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        setForm((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lon,
        }));

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
          );
          const data = await res.json();

          setForm((prev) => ({
            ...prev,
            location: data.display_name || `Lat: ${lat}, Lon: ${lon}`,
          }));

          setStatus("✅ Location updated");
        } catch {
          setForm((prev) => ({
            ...prev,
            location: `Lat: ${lat}, Lon: ${lon}`,
          }));
          setStatus("⚠️ Could not fetch address");
        }
      },
      () => {
        setStatus("⚠️ Location permission denied");
      },
      { enableHighAccuracy: true }
    );
  };

  // ✅ NLP Engine
  const runNlp = (text) => {
    text = text.trim();

    // ✅ Extract Name (very strong & case-insensitive)
    const nameMatch = text.match(
      /\b(my name is|i am|i'm|this is)\s+([a-zA-Z]+)/i
    );

    if (nameMatch) {
      let extracted = nameMatch[2].trim();
      extracted =
        extracted.charAt(0).toUpperCase() + extracted.slice(1).toLowerCase();

      setForm((prev) => ({ ...prev, name: extracted }));
    }

    // ✅ Extract Common Complaint Keywords
    const keywords = ["overflow", "smell", "bin full", "spill", "broken", "rats"];

    for (let k of keywords) {
      if (text.toLowerCase().includes(k)) {
        setForm((prev) => ({ ...prev, issue: k }));
        break;
      }
    }
  };

  // ✅ Start Voice Recognition
  const startVoice = () => {
    getLocationInstant(); // ✅ Fill location instantly

    const recog = initSpeech();
    if (!recog) return;

    recognitionRef.current = recog;

    recog.onstart = () => setStatus("🎙️ Listening...");
    recog.onerror = (e) => setStatus("Error: " + e.error);
    recog.onend = () => setStatus("🛑 Stopped");

    recog.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          transcript += event.results[i][0].transcript + " ";
        }
      }

      if (transcript.trim()) {
        setForm((prev) => ({ ...prev, issue: transcript.trim() }));
        runNlp(transcript.trim());
      }
    };

    recog.start();
  };

  // ✅ Stop Voice
  const stopVoice = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
  };

  // ✅ Submit Complaint
  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitVoiceComplaint(form);
    alert("✅ Voice complaint submitted!");
  };

  return (
    <div style={page}>
      <h2 style={title}>🎤 Voice Complaint</h2>

      <div style={{ display: "flex", gap: "10px" }}>
        <button style={btnBlue} onClick={startVoice}>Start Voice</button>
        <button style={btnRed} onClick={stopVoice}>Stop</button>
      </div>

      <p>{status}</p>

      <form style={card} onSubmit={handleSubmit}>
        <label style={label}>Name</label>
        <input
          style={input}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <label style={label}>Issue</label>
        <input
          style={input}
          value={form.issue}
          onChange={(e) => setForm({ ...form, issue: e.target.value })}
          required
        />

        <label style={label}>Location</label>
        <input
          style={input}
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          required
        />

        <button type="submit" style={btnGreen}>
          Submit Complaint
        </button>
      </form>
    </div>
  );
};

// ---------------------------
// INLINE STYLES
// ---------------------------
const page = { maxWidth: "600px", margin: "20px auto", padding: "10px" };
const title = { fontSize: "22px", fontWeight: "bold", marginBottom: "12px" };
const card = {
  background: "#fff",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};
const label = { fontWeight: "600" };
const input = {
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "8px",
};
const btnBlue = {
  background: "#0d6efd",
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
const btnRed = {
  background: "crimson",
  color: "white",
  padding: "10px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

export default VoiceComplaint;
