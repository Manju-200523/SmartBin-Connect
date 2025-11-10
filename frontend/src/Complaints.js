function Complaints() {
  const complaints = [
    { id: 1, user: "User A", message: "Bin 1 is full" },
    { id: 2, user: "User B", message: "Bin 3 is overflowing" }
  ];

  console.log("Complaints Output:");
  complaints.forEach(c => {
    console.log(`${c.user}: ${c.message}`);
  });
}

module.exports = Complaints;