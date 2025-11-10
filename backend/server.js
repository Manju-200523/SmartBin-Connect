const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const Complaint = require('./models/Complaint'); // your previous model

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

// Route to get all complaints
app.get('/complaints', async (req, res) => {
  try {
    const complaints = await Complaint.find();
    res.json(complaints);
  } catch (err) {
    res.status(500).send("Error fetching complaints");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});