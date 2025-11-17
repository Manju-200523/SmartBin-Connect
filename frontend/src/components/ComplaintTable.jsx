import "./ComplaintTable.css";

export default function ComplaintTable({ complaints, onStatusChange }) {
  return (
    <table className="complaint-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Issue</th>
          <th>Type</th>
          <th>Location</th>
          <th>Status</th>
          <th>Update</th>
        </tr>
      </thead>

      <tbody>
        {complaints.map((c) => (
          <tr key={c._id}>
            <td>{c.name}</td>
            <td>{c.issue}</td>
            <td>{c.type}</td>
            <td>{c.location}</td>
            <td>{c.status}</td>
            <td>
              <button
                onClick={() => onStatusChange(c._id, "resolved")}
                className="resolve-btn"
              >
                Resolve
              </button>

              <button
                onClick={() => onStatusChange(c._id, "closed")}
                className="close-btn"
              >
                Close
              </button>

              <button
                onClick={() => onStatusChange(c._id, "pending")}
                className="pending-btn"
              >
                Pending
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
