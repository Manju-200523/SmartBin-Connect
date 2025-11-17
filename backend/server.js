const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const Complaint = require('./models/Complaint');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
const mongoURI = process.env.MONGO_URI || 'your_mongodb_connection_string_here';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Atlas connected!'))
.catch(err => console.error('Connection error:', err));


// ---------------------------------------------------------
//  NEW: API Endpoint for receiving real-time bin data
// ---------------------------------------------------------

app.post("/api/bin/update", async (req, res) => {
  try {
    const data = req.body;

    /*
      DATA EXPECTED FROM FRIEND / ESP32:
      {
        "sensorId": "sensor_001",
        "binStatus": "full | overflow",
        "location": "Some place",
        "latitude": 12.91,
        "longitude": 77.60
      }
    */

    if (!data.sensorId || !data.binStatus || !data.location) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // -----------------------------------------------------------------
    // AI / automatic complaint generator (simple rule-based for now)
    // -----------------------------------------------------------------

    let issueText = "";

    if (data.binStatus === "overflow") {
      issueText = "Bin is overflowing. Immediate attention required.";
    } else if (data.binStatus === "full") {
      issueText = "Bin is full. Needs cleaning soon.";
    } else {
      issueText = `Bin status: ${data.binStatus}`;
    }

    // -----------------------------------------------------------------
    // STORE complaint using your same Complaint schema
    // -----------------------------------------------------------------

    const autoComplaint = await Complaint.create({
      name: data.sensorId,             
      issue: issueText,
      location: data.location,
      
      latitude: data.latitude || null,
      longitude: data.longitude || null,

      type: "auto",
      status: "pending"
    });

    return res.status(200).json({
      success: true,
      message: "Bin data received and complaint generated!",
      complaint: autoComplaint
    });

  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// ---------------------------------------------------------
// Existing route - fetch all complaints
// ---------------------------------------------------------
app.get("/api/complaints/all", async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ _id: -1 });
    res.json(complaints);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
