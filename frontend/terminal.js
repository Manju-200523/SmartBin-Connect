const Dashboard = require("./src/Dashboard");
const { getComplaints } = require("./src/api");

Dashboard();

async function showComplaints() {
  const complaints = await getComplaints();
  console.log("Complaints Output:");
  complaints.forEach(c => {
    console.log(${c.user}: ${c.message});
  });
}

showComplaints();