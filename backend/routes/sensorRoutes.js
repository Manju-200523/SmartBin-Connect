const express = require('express');
const router = express.Router();
const mysql = require('mysql2');


// Create MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'smartbin_db'
});

// Set the threshold (bin full level)
const BIN_FULL_THRESHOLD = 80;

// API endpoint: Receive sensor data
router.post('/sensor', (req, res) => {
  const { bin_id, bin_level, latitude, longitude } = req.body;

  if (!bin_id || !bin_level || !latitude || !longitude) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Insert into bin_logs
  const logSQL = 'INSERT INTO bin_logs (bin_id, bin_level, latitude, longitude) VALUES (?, ?, ?, ?)';
  db.query(logSQL, [bin_id, bin_level, latitude, longitude], (err, result) => {
    if (err) {
      console.error('Error inserting into bin_logs:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    console.log(`📥 New log for ${bin_id}: Level = ${bin_level}%`);

    // If bin level is above threshold, insert a complaint
    if (bin_level > BIN_FULL_THRESHOLD) {
      const issueText = `Bin ${bin_id} is ${bin_level}% full. Needs cleaning.`;
      const complaintSQL = 'INSERT INTO complaints (bin_id, issue) VALUES (?, ?)';
      db.query(complaintSQL, [bin_id, issueText], (err2) => {
        if (err2) {
          console.error('Error inserting complaint:', err2);
          return res.status(500).json({ message: 'Error creating complaint' });
        }
        console.log(`⚠️ Complaint created for ${bin_id}`);
      });
    }

    res.status(200).json({ message: 'Data inserted successfully' });
  });
});

// Get all bin logs
router.get('/logs', (req, res) => {
  const sql = 'SELECT * FROM bin_logs ORDER BY timestamp DESC';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching logs' });
    res.json(results);
  });
});

// Get all complaints
router.get('/complaints', (req, res) => {
  const sql = 'SELECT * FROM complaints ORDER BY created_at DESC';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching complaints' });
    res.json(results);
  });
});

// ✅ Manual complaint from user
router.post('/complaints/manual', (req, res) => {
  const { bin_id, issue } = req.body;

  if (!bin_id || !issue) {
    return res.status(400).json({ message: 'bin_id and issue required' });
  }

  const sql = 'INSERT INTO complaints (bin_id, issue, status) VALUES (?, ?, "Pending")';
  db.query(sql, [bin_id, issue], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error creating complaint' });
    res.json({ message: 'Manual complaint added successfully!' });
  });
});

// ✅ Update complaint status (Mark as resolved)
router.put('/complaints/:id/resolve', (req, res) => {
  const { id } = req.params;

  const sql = 'UPDATE complaints SET status = "Resolved" WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('❌ Error updating complaint:', err);
      return res.status(500).json({ message: 'Error updating complaint status' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    console.log(`✅ Complaint ${id} marked as Resolved`);
    res.json({ message: `Complaint ${id} marked as Resolved` });
  });
});


// ✅ Export router at the very end
module.exports = router;
