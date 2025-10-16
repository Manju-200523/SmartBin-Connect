const mongoose = require('mongoose');

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000); // 6-digit number
}

const complaintSchema = new mongoose.Schema({
  name: { type: String, required: true },
  issue: { type: String, required: false },
  location: { type: String, required: true },
  latitude: { type: Number },
  longitude: { type: Number },
  code: { type: Number, unique: true, default: generateCode }, // 6-digit code
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Complaint', complaintSchema);
