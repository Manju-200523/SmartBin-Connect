// src/api/axios.js
import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL, 
  withCredentials: false,
});

export default instance;

// optional helpers
export const submitVoiceComplaint = (payload) =>
  instance.post("/api/complaints/voice", payload);

export const submitManualComplaint = (payload) =>
  instance.post("/api/complaints/manual", payload);

export const fetchComplaints = () =>
  instance.get("/api/complaints");
