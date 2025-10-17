// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

// ✅ 1. Define allowed origins (frontend + localhost)
const allowedOrigins = [
  "http://localhost:3000",
  "https://your-frontend.netlify.app" // replace this with your actual Netlify domain
];

// ✅ 2. Manual CORS middleware (works 100% with Vercel)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200); // ✅ immediately handle preflight
  }

  next();
});

app.use(express.json());

// ✅ 3. MongoDB connection
const startMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB err:", err);
  }
};
startMongo();

// ✅ 4. Routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// ✅ 5. Export for Vercel
module.exports = app;

// ✅ 6. Local development
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
