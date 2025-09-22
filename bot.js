const express = require("express");
const fs = require("fs");
const path = require("path");
const TelegramBot = require("node-telegram-bot-api");

const app = express();
const PORT = process.env.PORT || 10000;

// ⚠️ Hardcoded token and group for simplicity (unsafe but per your request)
const BOT_TOKEN = "YOUR_TELEGRAM_BOT_TOKEN";
const ALLOWED_GROUP_ID = -1001234567890; // replace with your channel/group ID

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Serve tutorial endpoint
app.get("/tutorial/:file", (req, res) => {
  const fileName = req.params.file;
  const filePath = path.join(__dirname, "courses", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Tutorial not found" });
  }

  // ✅ Security: Only allow if request comes from your bot (super simple check)
  const referer = req.get("referer") || "";
  if (!referer.includes("your-netlify-miniapp.netlify.app")) {
    return res.status(403).json({ error: "Access denied" });
  }

  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

// Example: send tutorial links via bot
bot.onText(/\/tutorial (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const fileName = match[1];

  if (chatId !== ALLOWED_GROUP_ID) {
    return bot.sendMessage(chatId, "❌ You are not allowed to access tutorials.");
  }

  bot.sendMessage(chatId, `✅ Open tutorial: https://your-netlify-miniapp.netlify.app?tutorial=${fileName}`);
});








//************************************// // bot.js
// // Single file: Telegram bot + Express server (no .env). Replace placeholders below.

// const BOT_TOKEN = "REPLACE_WITH_YOUR_BOT_TOKEN";            // e.g. "12345:AA..."
// const BOT_USERNAME = "REPLACE_WITH_YOUR_BOT_USERNAME";     // without @, e.g. "MyTutorialBot"
// const CHANNEL_ID = "REPLACE_WITH_YOUR_CHANNEL_ID";         // e.g. "-1002915012797"
// const ADMIN_ID = Number("REPLACE_WITH_YOUR_ADMIN_ID");     // e.g. 7401044824
// const MINI_APP_URL = "https://REPLACE_WITH_YOUR_NETLIFY.app"; // your Netlify mini-app URL
// const SERVER_BASE_URL = "https://REPLACE_WITH_YOUR_SERVER_URL"; // the public URL of this server (Render/ngrok/localtunnel)
// const TOKEN_TTL_MS = 5 * 60 * 1000; // one-time token TTL (5 minutes)


// // ----------------- DO NOT EDIT BELOW UNLESS YOU KNOW WHAT YOU'RE DOING -----------------
// const express = require("express");
// const fs = require("fs");
// const path = require("path");
// const crypto = require("crypto");
// const TelegramBot = require("node-telegram-bot-api");
// const cors = require("cors");

// if (BOT_TOKEN.includes("REPLACE") || BOT_USERNAME.includes("REPLACE")) {
//   console.error("Please replace the placeholders at the top of bot.js with real values.");
//   process.exit(1);
// }

// const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Allow your Netlify app to call server endpoints
// app.use(cors({ origin: MINI_APP_URL }));

// // In-memory token store: token -> { tutorial, expiresAt }
// // Note: in production you should use Redis for persistence, but in-memory meets the 'simple' requirement.
// const tokens = new Map();

// function createToken(tutorial) {
//   const token = crypto.randomBytes(20).toString("hex");
//   const expiresAt = Date.now() + TOKEN_TTL_MS;
//   tokens.set(token, { tutorial, expiresAt });
//   // schedule removal
//   setTimeout(() => tokens.delete(token), TOKEN_TTL_MS + 1000);
//   return token;
// }

// // Telegram login widget signature verification (per Telegram docs)
// function verifyTelegramLogin(query) {
//   if (!query || !query.hash) return false;
//   const data = { ...query };
//   const hash = data.hash;
//   delete data.hash;

//   const dataCheckString = Object.keys(data)
//     .sort()
//     .map((k) => `${k}=${data[k]}`)
//     .join("\n");

//   // secret: SHA-256 of bot token
//   const secret = crypto.createHash("sha256").update(BOT_TOKEN).digest();
//   const hmac = crypto.createHmac("sha256", secret).update(dataCheckString).digest("hex");
//   return hmac === hash;
// }

// // ----------------- EXPRESS ENDPOINTS -----------------

// // Health
// app.get("/health", (req, res) => res.json({ ok: true }));

// // Entry point used in Telegram message buttons (bot will send SERVER_BASE_URL/open?tutorial=...)
// // This redirects users to your Netlify mini-app and includes server URL for verification
// app.get("/open", (req, res) => {
//   const tutorial = req.query.tutorial;
//   if (!tutorial) return res.status(400).send("Missing tutorial param");
//   const redirectUrl = `${MINI_APP_URL}?tutorial=${encodeURIComponent(tutorial)}&server=${encodeURIComponent(SERVER_BASE_URL)}`;
//   return res.redirect(302, redirectUrl);
// });

// // Telegram login widget callback: verifies telegram login payload, checks chat membership,
// // creates a one-time token, then redirects user back to Netlify with that token.
// app.get("/auth", async (req, res) => {
//   try {
//     const tutorial = req.query.tutorial;
//     if (!tutorial) return res.status(400).send("Missing tutorial");

//     // verify telegram login payload
//     if (!verifyTelegramLogin(req.query)) return res.status(403).send("Telegram verification failed");

//     const telegramId = parseInt(req.query.id, 10);
//     if (!telegramId) return res.status(400).send("Missing telegram id");

//     // check membership in channel/group
//     let member;
//     try {
//       member = await bot.getChatMember(CHANNEL_ID, telegramId);
//     } catch (err) {
//       console.error("getChatMember error:", err && err.message);
//       return res.status(500).send("Unable to verify membership (bot error)");
//     }

//     if (!member || !["member", "administrator", "creator"].includes(member.status)) {
//       return res.status(403).send("Access denied: you must be a channel member");
//     }

//     // create one-time token and redirect back to mini app
//     const token = createToken(tutorial);
//     const redirect = `${MINI_APP_URL}?tutorial=${encodeURIComponent(tutorial)}&auth=${encodeURIComponent(token)}`;
//     return res.redirect(302, redirect);
//   } catch (err) {
//     console.error("auth error:", err && err.stack ? err.stack : err);
//     return res.status(500).send("Server error");
//   }
// });

// // Mini app calls this to retrieve the tutorial (one-time token)
// app.get("/content", (req, res) => {
//   try {
//     const auth = req.query.auth;
//     if (!auth) return res.status(400).json({ ok: false, error: "Missing auth token" });

//     const record = tokens.get(auth);
//     if (!record) return res.status(403).json({ ok: false, error: "Invalid or expired token" });

//     // one-time use: delete token now
//     tokens.delete(auth);

//     const filePath = path.join(__dirname, "courses", record.tutorial);
//     if (!fs.existsSync(filePath)) return res.status(404).json({ ok: false, error: "Tutorial not found" });

//     const raw = fs.readFileSync(filePath, "utf8");
//     const data = JSON.parse(raw);
//     return res.json({ ok: true, tutorial: data });
//   } catch (err) {
//     console.error("content error:", err && err.stack ? err.stack : err);
//     return res.status(500).json({ ok: false, error: "Server error" });
//   }
// });

// // ----------------- TELEGRAM BOT COMMANDS -----------------

// bot.on("polling_error", console.error);

// // /post <filename> — posts a single tutorial button that points to server's /open endpoint
// bot.onText(/\/post (.+)/, (msg, match) => {
//   const userId = msg.from.id;
//   if (userId !== ADMIN_ID) return; // only admin can post

//   const filename = match[1];
//   const filePath = path.join(__dirname, "courses", filename);

//   if (!fs.existsSync(filePath)) {
//     bot.sendMessage(userId, "Tutorial not found!");
//     return;
//   }

//   try {
//     const raw = fs.readFileSync(filePath, "utf8");
//     const data = JSON.parse(raw);

//     const messageText = `📘 Subject: ${data.subject}
// 📖 Chapter: ${data.chapter}
// 👨‍🏫 Prepared by: ${data.prepared_by}
// 📝 ${data.description}`;

//     const openUrl = `${SERVER_BASE_URL}/open?tutorial=${encodeURIComponent(filename)}`;

//     const button = {
//       reply_markup: {
//         inline_keyboard: [
//           [
//             {
//               text: "Open Tutorial",
//               url: openUrl,
//             },
//           ],
//         ],
//       },
//       protect_content: true,
//     };

//     bot.sendMessage(CHANNEL_ID, messageText, button);
//   } catch (err) {
//     console.error(err);
//     bot.sendMessage(userId, "Error reading tutorial!");
//   }
// });

// // /postall — post all tutorials
// bot.onText(/\/postall/, (msg) => {
//   const userId = msg.from.id;
//   if (userId !== ADMIN_ID) return;

//   const files = fs.readdirSync(path.join(__dirname, "courses")).filter((f) => f.endsWith(".json"));

//   if (files.length === 0) {
//     bot.sendMessage(ADMIN_ID, "No tutorials found!");
//     return;
//   }

//   files.forEach((f) => {
//     const raw = fs.readFileSync(path.join(__dirname, "courses", f), "utf8");
//     const data = JSON.parse(raw);

//     const messageText = `📘 Subject: ${data.subject}
// 📖 Chapter: ${data.chapter}
// 👨‍🏫 Prepared by: ${data.prepared_by}
// 📝 ${data.description}`;

//     const openUrl = `${SERVER_BASE_URL}/open?tutorial=${encodeURIComponent(f)}`;

//     const button = {
//       reply_markup: {
//         inline_keyboard: [
//           [
//             {
//               text: "Open Tutorial",
//               url: openUrl,
//             },
//           ],
//         ],
//       },
//       protect_content: true,
//     };

//     bot.sendMessage(CHANNEL_ID, messageText, button);
//   });
// });

// // ----------------- START SERVER -----------------
// app.listen(PORT, () => {
//   console.log(`✅ Server running on port ${PORT}`);
//   console.log(`Server base url (configured): ${SERVER_BASE_URL}`);
// });






// // require("dotenv").config();
// // const fs = require("fs");
// // const TelegramBot = require("node-telegram-bot-api");

// // const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// // // Post a single tutorial
// // bot.onText(/\/post (.+)/, (msg, match) => {
// //   const userId = msg.from.id;
// //   if (userId != process.env.ADMIN_ID) return;

// //   const filename = match[1];
// //   const path = `./courses/${filename}`;
// //   if (!fs.existsSync(path)) {
// //     bot.sendMessage(userId, "❌ File not found");
// //     return;
// //   }

// //   const raw = fs.readFileSync(path, "utf-8");
// //   const data = JSON.parse(raw);

// //   const text = `📘 Subject: ${data.subject}
// // 📖 Chapter: ${data.chapter}
// // 👨‍🏫 Prepared by: ${data.prepared_by}
// // 📝 ${data.description}`;


// // const  url: `${process.env.MINI_APP_URL}?tutorial=${encodeURIComponent(filename)}&token=SECURE123`,

// //   // const url = `${process.env.SERVER_URL}/view?file=${encodeURIComponent(
// //   //   filename
// //   // )}&userId=${userId}`;

// //   bot.sendMessage(process.env.CHANNEL_ID, text, {
// //     reply_markup: {
// //       inline_keyboard: [[{ text: "📂 Open Tutorial", url }]],
// //     },
// //     protect_content: true,
// //   });
// // });


























// // // // Load environment variables
// // // require('dotenv').config();

// // // const fs = require("fs");
// // // const TelegramBot = require("node-telegram-bot-api");

// // // // ✅ Use environment variables
// // // const token = process.env.BOT_TOKEN;
// // // const CHANNEL_ID = process.env.CHANNEL_ID;
// // // const MINI_APP_URL = process.env.MINI_APP_URL;
// // // const ADMIN_ID = parseInt(process.env.ADMIN_ID); // convert to number
// // // const SECURE_TOKEN = process.env.SECURE_TOKEN;

// // // // Initialize bot
// // // const bot = new TelegramBot(token, { polling: true });

// // // // Polling error handler
// // // bot.on("polling_error", console.error);

// // // // /post command - post one tutorial
// // // bot.onText(/\/post (.+)/, (msg, match) => {
// // //   const userId = msg.from.id;
// // //   if (userId !== ADMIN_ID) return; // only admin can post

// // //   const filename = match[1]; // e.g., psychology_chapter1.json
// // //   const filePath = `./courses/${filename}`;

// // //   if (!fs.existsSync(filePath)) {
// // //     bot.sendMessage(userId, "Tutorial not found!");
// // //     return;
// // //   }

// // //   try {
// // //     const raw = fs.readFileSync(filePath, "utf-8");
// // //     const data = JSON.parse(raw);

// // //     const messageText = `📘 Subject: ${data.subject}
// // // 📖 Chapter: ${data.chapter}
// // // 👨‍🏫 Prepared by: ${data.prepared_by}
// // // 📝 ${data.description}`;

// // //     const button = {
// // //       reply_markup: {
// // //         inline_keyboard: [
// // //           [
// // //             {
// // //               text: "Open Tutorial",
// // //               url: `${MINI_APP_URL}?tutorial=${encodeURIComponent(
// // //                 filename
// // //               )}&token=${SECURE_TOKEN}`,
// // //             },
// // //           ],
// // //         ],
// // //       },
// // //       protect_content: true, // prevents others from forwarding
// // //     };

// // //     bot.sendMessage(CHANNEL_ID, messageText, button);
// // //   } catch (err) {
// // //     console.error(err);
// // //     bot.sendMessage(userId, "Error reading tutorial!");
// // //   }
// // // });

// // // // /postall command - post all tutorials
// // // bot.onText(/\/postall/, (msg) => {
// // //   const userId = msg.from.id;
// // //   if (userId !== ADMIN_ID) return; // only admin can post

// // //   const files = fs.readdirSync("./courses").filter((f) => f.endsWith(".json"));

// // //   if (files.length === 0) {
// // //     bot.sendMessage(userId, "No tutorials found!");
// // //     return;
// // //   }

// // //   files.forEach((f) => {
// // //     const raw = fs.readFileSync(`./courses/${f}`, "utf-8");
// // //     const data = JSON.parse(raw);

// // //     const messageText = `📘 Subject: ${data.subject}
// // // 📖 Chapter: ${data.chapter}
// // // 👨‍🏫 Prepared by: ${data.prepared_by}
// // // 📝 ${data.description}`;

// // //     const button = {
// // //       reply_markup: {
// // //         inline_keyboard: [
// // //           [
// // //             {
// // //               text: "Open Tutorial",
// // //               url: `${MINI_APP_URL}?tutorial=${encodeURIComponent(
// // //                 f
// // //               )}&token=${SECURE_TOKEN}`,
// // //             },
// // //           ],
// // //         ],
// // //       },
// // //       protect_content: true,
// // //     };

// // //     bot.sendMessage(CHANNEL_ID, messageText, button);
// // //   });
// // // });
