// server.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors"); // ✅ 1. Import cors

dotenv.config();
const app = express();

// ✅ 2. Define your allowed origins
const allowedOrigins = [
  "http://localhost:3000",
  "https://tug-frontend.netlify.app"
];

// ✅ 3. Use the cors middleware with options
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = "The CORS policy for this site does not allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true, // Allow cookies to be sent
}));


// ❌ DELETE YOUR OLD MIDDLEWARE
/*
app.use((req, res, next) => {
  ... your old code here ...
});
*/

app.use(express.json());

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB error:", err));

// ✅ Routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// ✅ Export for Vercel
module.exports = app;

// ✅ Local run support
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}