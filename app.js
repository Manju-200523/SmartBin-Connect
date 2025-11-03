// Load environment variables first
require('dotenv').config({ path: './hugging.env' });
const token = process.env.HUGGING_FACE_TOKEN;

// Import modules
const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const methodOverride = require('method-override');
const Complaint = require('./models/complaintSchema.js'); // your schema

// Express setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static('public'));

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/complaintsDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// HuggingFace API function
async function huggingFaceAPI(token, inputData) {
  const MODEL_ID = 'google/vit-base-patch16-224';
  const response = await axios.post(
    `https://api-inference.huggingface.co/models/${MODEL_ID}`,
    { inputs: inputData },
    { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
  );
  return response;
}

// ---------- Manual routes ----------

app.get('/complaint', (req, res) => res.render('manualcomplaint'));

app.post('/complaint-submit', async (req, res) => {
  try {
    const { name, issue, location, latitude, longitude } = req.body;
    const complaint = new Complaint({ name, issue, location, latitude, longitude });
    await complaint.save();
    res.send(`Complaint submitted successfully! Your complaint code is: ${complaint.code}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error submitting complaint. Please try again.');
  }
});

app.get('/voice', (req, res) => res.render('voiceForm.ejs'));

app.post('/voice-submit', async (req, res) => {
  try {
    const { name, issue, location, latitude, longitude } = req.body;
    if (!issue) return res.send('Issue is required');
    const complaint = new Complaint({
      name: name || 'Anonymous',
      issue,
      location,
      latitude,
      longitude
    });
    await complaint.save();
    res.send(`Complaint submitted successfully! Your complaint code is: ${complaint.code}`);
  } catch (err) {
    console.error(err);
    res.send('Error saving complaint');
  }
});

app.get('/image', (req, res) => res.render('imageForm'));

app.post('/detect-issue', upload.single('image'), async (req, res) => {
  try {
    const imageBytes = fs.readFileSync(req.file.path, { encoding: 'base64' });
    const response = await huggingFaceAPI(token, imageBytes);
    const issue = response.data[0]?.label || "Unknown";
    res.json({ issue });
  } catch (err) {
    console.error(err.response?.data || err);
    res.json({ issue: "Detection failed" });
  }
});

app.post('/image-submit', upload.single('image'), async (req, res) => {
  try {
    const { name, location, issue, latitude, longitude } = req.body;
    const complaint = new Complaint({
      name,
      issue,
      location,
      latitude,
      longitude,
      image: req.file.path
    });
    await complaint.save();
    res.send(`✅ Complaint submitted! Code: ${complaint.code}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error submitting complaint");
  }
});

// ---------- NEW: Arduino / Hardware endpoint ----------
app.post('/arduino-data', async (req, res) => {
  try {
    const { sensorId, binStatus, location, latitude, longitude } = req.body;

    if (!sensorId || !binStatus) {
      return res.status(400).send("sensorId and binStatus are required");
    }

    // Auto-generate issue
    let issue = '';
    switch (binStatus.toLowerCase()) {
      case 'full':
        issue = 'Bin is full';
        break;
      case 'overflow':
        issue = 'Bin overflow detected';
        break;
      default:
        issue = 'General bin issue';
    }

    const complaint = new Complaint({
      name: 'Auto Generated',
      issue,
      location,
      latitude,
      longitude
    });

    await complaint.save();
    console.log(`✅ Auto complaint saved for sensor: ${sensorId}, code: ${complaint.code}`);

    res.status(200).send({ message: 'Complaint logged', code: complaint.code });
  } catch (err) {
    console.error('Error processing Arduino data:', err);
    res.status(500).send('Error saving complaint');
  }
});

// ---------- Start server ----------
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
