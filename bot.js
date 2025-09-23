const express = require("express");
const fs = require("fs");
const path = require("path");
const TelegramBot = require("node-telegram-bot-api");

const app = express();
const PORT = process.env.PORT || 10000;

// ⚠️ Replace with your bot token, group ID, and your Telegram user ID
const BOT_TOKEN = "7622044405:AAG4TbGfbQktuPrrFqtqU2os_PJom4vxpog";
const ALLOWED_GROUP_ID = -1003054441977;
const ADMIN_ID = 7401044824;

// Security token for mini app fetch
const SERVER_TOKEN = "SECURE123";

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// -----------------------------
// Serve tutorial endpoint
// -----------------------------
app.get("/tutorial/:file", (req, res) => {
  const fileName = req.params.file;
  const token = req.query.token;
  const filePath = path.join(__dirname, "courses", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Tutorial not found" });
  }

  // ✅ Only allow requests with the correct token
  if (token !== SERVER_TOKEN) {
    return res.status(403).json({ error: "Access denied" });
  }

  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  res.json(data);
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

// -----------------------------
// Telegram bot: only admin can post
// -----------------------------
bot.onText(/\/tutorial (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const fileName = match[1];

  // Restrict to your group
  if (chatId !== ALLOWED_GROUP_ID) {
    return bot.sendMessage(chatId, "❌ You are not allowed to access tutorials.");
  }

  // Only admin can post
  if (userId !== ADMIN_ID) {
    return bot.sendMessage(chatId, "❌ Only the admin can post tutorials.");
  }

  // Send tutorial link with token
  bot.sendMessage(
    chatId,
    `✅ Open tutorial: https://glistening-panda-32a0f8.netlify.app?tutorial=${fileName}&token=${SERVER_TOKEN}`
  );
});
