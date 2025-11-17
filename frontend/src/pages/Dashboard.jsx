import React, { useEffect, useState } from "react";
import axios from "../api/axios";

const Dashboard = () => {
  const [complaints, setComplaints] = useState([]);

  // ✅ Fetch all complaints from backend
  const loadComplaints = async () => {
    try {
      const res = await axios.get("/api/complaints");
      setComplaints(res.data);
    } catch (err) {
      console.error("Error loading complaints", err);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  // ✅ Update status only (B — your option)
  const updateStatus = async (id, newStatus) => {
    try {
      await axios.patch(`/api/complaints/${id}/status`, { status: newStatus });

      // ✅ Update UI instantly
      setComplaints((prev) =>
        prev.map((c) =>
          c._id === id ? { ...c, status: newStatus } : c
        )
      );
    } catch (err) {
      console.error("Status update failed", err);
    }
  };

  return (
    <div style={page}>
      <h2 style={title}>📊 Complaint Dashboard</h2>

      <div style={grid}>
        {complaints.map((c) => (
          <div key={c._id} style={card}>
            <p><b>Name:</b> {c.name}</p>
            <p><b>Issue:</b> {c.issue}</p>
            <p><b>Location:</b> {c.location}</p>
            <p><b>Type:</b> {c.type}</p>

            <p>
              <b>Status:</b>{" "}
              <span style={{
                ...badge,
                background:
                  c.status === "pending"
                    ? "#ffc107"
                    : c.status === "in-progress"
                    ? "#0dcaf0"
                    : "green",
                color: "white"
              }}>
                {c.status}
              </span>
            </p>

            {/* ✅ Buttons */}
            <div style={btnRow}>
              {c.status === "pending" && (
                <button
                  style={btnBlue}
                  onClick={() => updateStatus(c._id, "in-progress")}
                >
                  Start
                </button>
              )}

              {c.status !== "resolved" && (
                <button
                  style={btnGreen}
                  onClick={() => updateStatus(c._id, "resolved")}
                >
                  ✅ Resolve
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ✅ INLINE STYLE BLOCK
const page = { padding: "20px", maxWidth: "1000px", margin: "auto" };
const title = { fontSize: "24px", fontWeight: "bold", marginBottom: "20px" };

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: "20px",
};

const card = {
  background: "#fff",
  padding: "15px",
  borderRadius: "10px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const badge = {
  padding: "4px 8px",
  borderRadius: "6px",
  fontSize: "12px",
  fontWeight: "600",
};

const btnRow = {
  display: "flex",
  gap: "10px",
  marginTop: "10px",
};

const btnBlue = {
  background: "#0d6efd",
  color: "white",
  padding: "8px 12px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

const btnGreen = {
  background: "green",
  color: "white",
  padding: "8px 12px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

export default Dashboard;
