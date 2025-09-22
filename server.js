require("dotenv").config();
const express = require("express");
const fs = require("fs");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 10000;

// ✅ Middleware: check if user is in your channel
async function checkMembership(userId) {
  const url = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/getChatMember?chat_id=${process.env.CHANNEL_ID}&user_id=${userId}`;
  const res = await fetch(url);
  const data = await res.json();
  return (
    data.ok &&
    (data.result.status === "member" ||
      data.result.status === "administrator" ||
      data.result.status === "creator")
  );
}

// ✅ Endpoint: view tutorial
app.get("/view", async (req, res) => {
  const { file, userId } = req.query;
  if (!file || !userId) return res.status(400).send("Missing params");

  // Check channel membership
  const isMember = await checkMembership(userId);
  if (!isMember) return res.status(403).send("❌ Access denied: Join the channel!");

  // Check if file exists
  const path = `./courses/${file}`;
  if (!fs.existsSync(path)) return res.status(404).send("File not found");

  // Send tutorial JSON
  const data = fs.readFileSync(path, "utf-8");
  res.json(JSON.parse(data));
});

// Start server
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
