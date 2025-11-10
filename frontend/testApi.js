// testApi.js
const axios = require("axios"); // Node.js uses require, NOT import

const BASE_URL = "http://localhost:5000"; // replace with your backend URL

// Test fetching all complaints
async function getComplaints() {
  try {
    const res = await axios.get(`${BASE_URL}/complaints`);
    console.log("Fetched complaints:");
    console.log(res.data);
  } catch (err) {
    console.error("Error fetching complaints:", err.message);
  }
}

// Run the test
getComplaints();