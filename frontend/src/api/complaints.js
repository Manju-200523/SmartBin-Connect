import axios from "axios";

// Decide backend URL:
// - When running `npm start` (development): use your local backend
// - When built for Vercel (production): use REACT_APP_BACKEND_URL from Vercel
const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : process.env.REACT_APP_BACKEND_URL;

// Debug log – you can remove later if you want
console.log("[SmartBin] API_BASE_URL =", API_BASE_URL);

if (!API_BASE_URL) {
  console.error(
    "[SmartBin] API base URL is NOT defined. " +
      "Set REACT_APP_BACKEND_URL in Vercel for production."
  );
}

const API = axios.create({
  baseURL: API_BASE_URL,
});

// Manual complaint submit (still mock)
export const submitManualComplaint = async (data) => {
  console.log("Mock API request:", data);
  return { data: { success: true, message: "Mock complaint saved!" } };
};

// Detect issue from image
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

// Submit voice complaint
export const submitVoiceComplaint = async (data) => {
  return API.post("/api/complaints/voice", data, {
    headers: { "Content-Type": "application/json" },
  });
};
