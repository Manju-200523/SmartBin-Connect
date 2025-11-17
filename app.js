// Load environment variables
require("dotenv").config({ path: "./hugging.env" });
const token = process.env.HUGGING_FACE_TOKEN;

// Imports
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const Complaint = require("./models/complaintSchema.js");

// Middleware
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(require("cors")());

// MongoDB
mongoose.connect(process.env.MONGO_URI)

  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ Mongo error:", err.message));

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// HuggingFace API
async function huggingFaceAPI(token, imageBytes) {
  try {
    const MODEL_ID = "google/vit-base-patch16-224";
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${MODEL_ID}`,
      { inputs: imageBytes },
      { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
    );
    return response;
  } catch (err) {
    console.error("HF Error:", err.response?.data || err);
    throw err;
  }
}

// ===================================================
// ✅ MANUAL COMPLAINT
// ===================================================
app.post("/api/complaints/manual", async (req, res) => {
  try {
    const { name, issue, location, latitude, longitude } = req.body;

    const c = await Complaint.create({
      name,
      issue,
      location,
      latitude,
      longitude,
      type: "manual",
    });

    res.json({ success: true, complaint: c });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

// ===================================================
// ✅ VOICE COMPLAINT
// ===================================================
app.post("/api/complaints/voice", async (req, res) => {
  try {
    const { name, issue, location, latitude, longitude } = req.body;

    const c = await Complaint.create({
      name: name || "Anonymous",
      issue,
      location,
      latitude,
      longitude,
      type: "voice",
    });

    res.json({ success: true, complaint: c });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

// ===================================================
// ✅ IMAGE DETECTION (frontend sends image file)
// ===================================================
app.post("/api/complaints/detect-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ issue: "No image received" });

    const imgBytes = fs.readFileSync(req.file.path, { encoding: "base64" });
    const response = await huggingFaceAPI(token, imgBytes);

    const issue = response.data?.[0]?.label || "Unknown";

    res.json({ issue });
  } catch (err) {
    console.error("Detection error:", err);
    res.json({ issue: "Detection failed" });
  }
});

// ===================================================
// ✅ IMAGE COMPLAINT SUBMISSION
// ===================================================
app.post("/api/complaints/image", upload.single("image"), async (req, res) => {
  try {
    const { name, issue, location, latitude, longitude } = req.body;

    const c = await Complaint.create({
      name,
      issue,
      location,
      latitude,
      longitude,
      image: req.file?.path || null,
      type: "image",
    });

    res.json({ success: true, complaint: c });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

// ===================================================
// ✅ AUTO COMPLAINT (Arduino / IoT)
// ===================================================
// ===================================================
// ✅ AUTO COMPLAINT (Arduino / IoT)
// ===================================================
app.post("/api/complaints/auto", async (req, res) => {
  try {
    const { sensorId, binStatus, location, latitude, longitude } = req.body;

    // Validate required
    if (!sensorId || !binStatus || !location) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: sensorId, binStatus, location"
      });
    }

    // Generate issue text
    let issue = "General bin issue";
    if (binStatus === "full") issue = "Bin is full";
    if (binStatus === "overflow") issue = "Bin overflow detected";

    // Create complaint
    const complaint = await Complaint.create({
      name: sensorId,
      issue,
      location,
      latitude,
      longitude,
      type: "auto",
      status: "pending"
    });

    // Response
    res.json({
      success: true,
      message: "Auto complaint generated successfully",
      complaint
    });

  } catch (err) {
    console.error("Auto Complaint Error:", err);
    res.status(500).json({ success: false });
  }
});

// ===================================================
// ✅ DASHBOARD (get all complaints)
// ===================================================
app.get("/api/complaints", async (req, res) => {
  try {
    const data = await Complaint.find().sort({ createdAt: -1 });
    res.json(data);
  } catch {
    res.status(500).json([]);
  }
});
// ✅ UPDATE COMPLAINT STATUS
app.patch("/api/complaints/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const updated = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Complaint not found" });
    }

    res.json({ success: true, complaint: updated });
  } catch (err) {
    console.error("Status Update Error:", err);
    res.status(500).json({ success: false });
  }
});



// ===================================================
// ✅ START SERVER
// ===================================================
app.listen(3000, () => console.log("✅ Backend running on port 3000"));
