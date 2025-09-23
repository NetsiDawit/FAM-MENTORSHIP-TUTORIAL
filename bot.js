const express = require("express");
const fs = require("fs");
const path = require("path");
const TelegramBot = require("node-telegram-bot-api");

const app = express();
const PORT = process.env.PORT || 10000;

// Hardcoded values (replace with your own)
const BOT_TOKEN = "7622044405:AAG4TbGfbQktuPrrFqtqU2os_PJom4vxpog";
const ALLOWED_GROUP_ID = -1003054441977; // your channel/group ID
const ADMIN_ID = 7401044824; // your Telegram user ID
const SERVER_TOKEN = "SECURE123";
const MINI_APP_URL = "https://fam-mentorship-tutorial.onrender.com"; // your server URL

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Serve tutorials securely
app.get("/tutorial/:file", (req, res) => {
  const fileName = req.params.file;
  const token = req.query.token;
  const filePath = path.join(__dirname, "courses", fileName);

  if (!fs.existsSync(filePath))
    return res.status(404).json({ error: "Tutorial not found" });

  if (token !== SERVER_TOKEN)
    return res.status(403).json({ error: "Access denied" });

  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  res.json(data);
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

// Only admin can post tutorials
bot.onText(/\/tutorial (.+)/, (msg, match) => {
  const fileName = match[1];
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const filePath = path.join(__dirname, "courses", fileName);

  if (userId !== ADMIN_ID)
    return bot.sendMessage(chatId, "❌ Only the admin can post tutorials.");

  if (!fs.existsSync(filePath))
    return bot.sendMessage(chatId, "❌ Tutorial not found!");

  // Read tutorial data
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

  // Build message text
const MINI_APP_URL = "https://glistening-panda-32a0f8.netlify.app"; // your deployed mini app
const messageText = `📘 Subject: ${data.subject}
📖 Chapter: ${data.chapter}
👨‍🏫 Prepared by: ${data.prepared_by}
📝 ${data.description}`;

const button = {
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: "Open Tutorial",
          url: `${MINI_APP_URL}?tutorial=${encodeURIComponent(fileName)}`
        }
      ]
    ]
  }
};

bot.sendMessage(chatId, messageText, button);

 bot.sendMessage(chatId, `✅ Tutorial posted to the channel as a button.`);
});
