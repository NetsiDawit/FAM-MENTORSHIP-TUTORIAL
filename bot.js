// // Load environment variables
// require('dotenv').config();

// const fs = require("fs");
// const TelegramBot = require("node-telegram-bot-api");

// // ✅ Use environment variables
// const token = process.env.BOT_TOKEN;
// const CHANNEL_ID = process.env.CHANNEL_ID;
// const MINI_APP_URL = process.env.MINI_APP_URL;
// const ADMIN_ID = parseInt(process.env.ADMIN_ID); // convert to number
// const SECURE_TOKEN = process.env.SECURE_TOKEN;

// // Initialize bot
// const bot = new TelegramBot(token, { polling: true });

// // Polling error handler
// bot.on("polling_error", console.error);

// // /post command - post one tutorial
// bot.onText(/\/post (.+)/, (msg, match) => {
//   const userId = msg.from.id;
//   if (userId !== ADMIN_ID) return; // only admin can post

//   const filename = match[1]; // e.g., psychology_chapter1.json
//   const filePath = `./courses/${filename}`;

//   if (!fs.existsSync(filePath)) {
//     bot.sendMessage(userId, "Tutorial not found!");
//     return;
//   }

//   try {
//     const raw = fs.readFileSync(filePath, "utf-8");
//     const data = JSON.parse(raw);

//     const messageText = `📘 Subject: ${data.subject}
// 📖 Chapter: ${data.chapter}
// 👨‍🏫 Prepared by: ${data.prepared_by}
// 📝 ${data.description}`;

//     const button = {
//       reply_markup: {
//         inline_keyboard: [
//           [
//             {
//               text: "Open Tutorial",
//               url: `${MINI_APP_URL}?tutorial=${encodeURIComponent(
//                 filename
//               )}&token=${SECURE_TOKEN}`,
//             },
//           ],
//         ],
//       },
//       protect_content: true, // prevents others from forwarding
//     };

//     bot.sendMessage(CHANNEL_ID, messageText, button);
//   } catch (err) {
//     console.error(err);
//     bot.sendMessage(userId, "Error reading tutorial!");
//   }
// });

// // /postall command - post all tutorials
// bot.onText(/\/postall/, (msg) => {
//   const userId = msg.from.id;
//   if (userId !== ADMIN_ID) return; // only admin can post

//   const files = fs.readdirSync("./courses").filter((f) => f.endsWith(".json"));

//   if (files.length === 0) {
//     bot.sendMessage(userId, "No tutorials found!");
//     return;
//   }

//   files.forEach((f) => {
//     const raw = fs.readFileSync(`./courses/${f}`, "utf-8");
//     const data = JSON.parse(raw);

//     const messageText = `📘 Subject: ${data.subject}
// 📖 Chapter: ${data.chapter}
// 👨‍🏫 Prepared by: ${data.prepared_by}
// 📝 ${data.description}`;

//     const button = {
//       reply_markup: {
//         inline_keyboard: [
//           [
//             {
//               text: "Open Tutorial",
//               url: `${MINI_APP_URL}?tutorial=${encodeURIComponent(
//                 f
//               )}&token=${SECURE_TOKEN}`,
//             },
//           ],
//         ],
//       },
//       protect_content: true,
//     };

//     bot.sendMessage(CHANNEL_ID, messageText, button);
//   });
// });
