const express = require("express");
const fs = require("fs");
const path = require("path");
const TelegramBot = require("node-telegram-bot-api");

const app = express();
const PORT = process.env.PORT || 10000;

// Hardcoded values
const BOT_TOKEN = "7622044405:AAG4TbGfbQktuPrrFqtqU2os_PJom4vxpog";
const CHANNEL_ID = -1003054441977; // your channel/group ID
const ADMIN_ID = 7401044824; // your Telegram user ID
const SERVER_TOKEN = "SECURE123";
const MINI_APP_URL = "https://glistening-panda-32a0f8.netlify.app"; // your deployed mini app

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// --------------------------
// Express server to serve tutorials
// --------------------------
app.get("/tutorial/:file", (req, res) => {
  const fileName = req.params.file;
  const token = req.query.token; // check query param
  const filePath = path.join(__dirname, "courses", fileName);

  if (!fs.existsSync(filePath))
    return res.status(404).json({ error: "Tutorial not found" });

  if (token !== SERVER_TOKEN)
    return res.status(403).json({ error: "Access denied" });

  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  res.json(data);
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

// --------------------------
// Telegram bot command to post tutorial
// --------------------------
bot.onText(/\/tutorial (.+)/, (msg, match) => {
  const fileName = match[1];
  const userId = msg.from.id;

  // Only admin can post
  if (userId !== ADMIN_ID)
    return bot.sendMessage(userId, "❌ Only the admin can post tutorials.");

  const filePath = path.join(__dirname, "courses", fileName);
  if (!fs.existsSync(filePath))
    return bot.sendMessage(userId, "❌ Tutorial not found!");

  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

  // Build message text
  const messageText = `📘 Subject: ${data.subject}
📖 Chapter: ${data.chapter}
👨‍🏫 Prepared by: ${data.prepared_by}
📝 ${data.description}`;

  // Inline button linking to mini app with server token
  const button = {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Open Tutorial",
            url: `${MINI_APP_URL}?tutorial=${encodeURIComponent(
              fileName
            )}&token=${SERVER_TOKEN}`
          }
        ]
      ]
    }
  };

  // ✅ Send to your **channel** instead of admin chat
  bot.sendMessage(CHANNEL_ID, messageText, button);
});
