import React, { useState, useEffect } from "react";

const Dashboard = () => {
  const [complaints, setComplaints] = useState([]);

  const fetchComplaints = () => {
    fetch("http://localhost:5000/complaints")
      .then((res) => res.json())
      .then((data) => setComplaints(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchComplaints(); // initial fetch
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Complaints Dashboard</h2>
      <table
        border="1"
        cellPadding="10"
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th>Code</th>
            <th>Bin ID</th>
            <th>Location</th>
            <th>Status</th>
            <th>Last Update</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((complaint) => (
            <tr key={complaint.code}>
              <td>{complaint.code}</td>
              <td>{complaint.binId}</td>
              <td>{complaint.location}</td>
              <td>{complaint.status}</td>
              <td>{complaint.lastUpdate || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;