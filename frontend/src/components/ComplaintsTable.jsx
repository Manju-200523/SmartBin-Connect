import React from 'react';
import useComplaints from '../hooks/useComplaints';
import { resolveComplaint } from '../api';

export default function ComplaintsTable() {
  const { complaints, setComplaints } = useComplaints();

  const handleResolve = async (id) => {
    await resolveComplaint(id);
    setComplaints(
      complaints.map(c => c.complaint_id === id ? {...c, resolved: true} : c)
    );
  };

  return (
    <table border="1" cellPadding="5">
      <thead>
        <tr>
          <th>Bin</th>
          <th>Mode</th>
          <th>Message</th>
          <th>Resolved</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {complaints.map(c => (
          <tr key={c.complaint_id}>
            <td>{c.bin_id}</td>
            <td>{c.mode}</td>
            <td>{c.message}</td>
            <td>{c.resolved ? 'Yes' : 'No'}</td>
            <td>
              {!c.resolved && <button onClick={() => handleResolve(c.complaint_id)}>Resolve</button>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}