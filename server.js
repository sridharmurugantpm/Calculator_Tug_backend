// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use(cors({ origin: "*" }));


// MongoDB Connection
const startMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB err:", err);
  }
};

// call startMongo when running in server mode or by the serverless wrapper (it will run once per cold start)
startMongo();

// Routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// Export the app (for serverless wrapper)
module.exports = app;

// If this file is run directly (node server.js), start a listener (local dev / Render)
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
