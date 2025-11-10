import axios from "axios"; // make sure axios is installed

const BASE_URL = process.env.REACT_APP_API_BASE; // gets URL from .env

// Get all complaints
export async function getComplaints() {
  try {
    const res = await axios.get(`${BASE_URL}/complaints`);
    return res.data;
  } catch (err) {
    console.error("Error fetching complaints:", err.message);
    return [];
  }
}

// Add new complaint
export async function addComplaint(complaint) {
  try {
    const res = await axios.post(`${BASE_URL}/complaints`, complaint);
    return res.data;
  } catch (err) {
    console.error("Error adding complaint:", err.message);
    return null;
  }
}

// Resolve a complaint
export async function resolveComplaint(id) {
  try {
    const res = await axios.post(`${BASE_URL}/complaints/${id}/resolve`);
    return res.data;
  } catch (err) {
    console.error("Error resolving complaint:", err.message);
    return null;
  }
}