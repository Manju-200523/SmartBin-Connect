import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL, 
});

// Manual complaint submit
export const submitManualComplaint = async (data) => {
  console.log("Mock API request:", data);
  return { data: { success: true, message: "Mock complaint saved!" } };
};

// Detect issue in image
// Detect issue using image
export const detectIssueFromImage = async (formData) => {
  return API.post("/api/complaints/detect-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Submit image complaint
export const submitImageComplaint = async (formData) => {
  return API.post("/api/complaints/image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};


// Get all complaints
export const getAllComplaints = async () => {
  return API.get("/api/complaints");
};

// Update complaint status
export const updateComplaintStatus = async (id, status) => {
  return API.patch(`/api/complaints/${id}/status`, { status });
};
export const submitVoiceComplaint = async (data) => {
  return API.post("/api/complaints/voice", data);
};
