// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

// ✅ Proper CORS configuration
const allowedOrigins = [
  "http://localhost:3000",          // local React app
  "https://your-frontend.netlify.app" // your Netlify frontend (replace this)
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

// ✅ handle OPTIONS preflight requests explicitly (important for Vercel)
app.options("*", cors());

// MongoDB Connection
const startMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB err:", err);
  }
};

startMongo();

// Routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// Export app for Vercel serverless
module.exports = app;

// Run locally
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
