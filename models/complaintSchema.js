const mongoose = require("mongoose");

const ComplaintSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    issue: { type: String, required: true },
    location: { type: String, required: true },

    latitude: { type: Number, required: false },
    longitude: { type: Number, required: false },

    type: { type: String, enum: ["manual", "image", "voice", "auto"], required: true },

    image: { type: String }, // Only for image complaints

    status: { type: String, enum: ["pending", "in-progress", "resolved"], default: "pending" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Complaint", ComplaintSchema);
