const express = require('express');
const app = express();
const port =3000
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const Complaint = require('./models/complaintSchema.js'); // your existing schema
//const uploads = require('./multer'); // your multer setup
const methodOverride = require('method-override');
const response = await huggingFaceAPI(token, inputData);


require('dotenv').config({ path: './hugging.env' }); // <-- load hugging.env
const token = process.env.HUGGING_FACE_TOKEN;



const MODEL_ID = 'google/vit-base-patch16-224';

app.use(express.urlencoded({ extended: true })); // for form submissions
app.use(express.json()); // for JSON payloads (optional)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static('public'));

const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb){
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

mongoose.connect('mongodb://localhost:27017/complaintsDB', { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/complaint', (req, res) => {
    res.render('manualcomplaint');
});




// POST route for submitting complaint
app.post('/complaint-submit', async (req, res) => {
  try {
    const { name, issue, location, latitude, longitude } = req.body;

    // Create new complaint document
    const complaint = new Complaint({
      name,
      issue,
      location,
      latitude,
      longitude
      // 'code' is auto-generated from schema default
    });

    await complaint.save(); // saves to MongoDB

    // Send confirmation with user-friendly 6-digit code
    res.send(`Complaint submitted successfully! Your complaint code is: ${complaint.code}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error submitting complaint. Please try again.');
  }
});
app.get('/voice', (req, res) => {
  res.render('voiceForm.ejs'); // this EJS form we will create next
});

app.post('/voice-submit', async (req, res) => {
  try {
    const { name, issue, location, latitude, longitude } = req.body;

    if (!issue) return res.send('Issue is required');

    const c = new Complaint({
      name: name || 'Anonymous',
      issue,
      location,
      latitude,
      longitude
    });

    await c.save();
    res.send(`Complaint submitted successfully! Your complaint code is: ${c.code}`);
  } catch (err) {
    console.error(err);
    res.send('Error saving complaint');
  }
});

app.get('/image', (req, res) => {
    res.render('imageForm'); // render the EJS form
});

 // corrected variable name

// temporary route to detect issue and return description
app.post('/detect-issue', upload.single('image'), async (req, res) => {
  try {
    const imagePath = req.file.path;
    const imageBytes = fs.readFileSync(imagePath, { encoding: 'base64' });

    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${MODEL_ID}`,
      { inputs: imageBytes },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const issue = response.data[0]?.label || "Unknown";
    res.json({ issue });
  } catch (err) {
    console.error(err.response?.data || err);
    res.json({ issue: "Detection failed" });
  }
});

// POST route to handle image submission
app.post('/image-submit', upload.single('image'), async (req, res) => {
  try {
    const { name, location, issue, latitude, longitude } = req.body;
    const imagePath = req.file.path;

    const complaint = new Complaint({
      name,
      issue,
      location,
      latitude,
      longitude,
      image: imagePath
    });

    await complaint.save();
    res.send(`✅ Complaint submitted! Code: ${complaint.code}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error submitting complaint");
  }
});




app.listen(3000, () => {
    console.log('Server is running on port 3000');
});