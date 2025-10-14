const express = require('express');
const app = express();
const port =3000
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/complaintsDB', { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/complaint', (req, res) => {
    res.render('manualcomplaint');
});

const Complaint = require('./models/complaintschema');


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





app.listen(3000, () => {
    console.log('Server is running on port 8080');
});