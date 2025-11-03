const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

// Import the existing Complaint schema
const Complaint = require('../models/complaintSchema');

require('dotenv').config(); // for any env variables

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB (use the same DB as main project)
mongoose.connect('mongodb://localhost:27017/complaintsDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected!'))
.catch(err => console.error(err));
