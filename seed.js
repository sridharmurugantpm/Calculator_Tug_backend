// seed.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
require("dotenv").config();

// MongoDB connect
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Seed User Data
const seedUser = async () => {
  try {
    const existingUser = await User.findOne({ username: "testuser" });
    if(existingUser) {
      console.log("User already exists!");
      mongoose.connection.close();
      return;
    }

    const hashedPassword = await bcrypt.hash("321", 10);

    const newUser = new User({
      username: "sri@gmail.com",
      password: hashedPassword
    });

    await newUser.save();
    console.log("Seed user created!");
    mongoose.connection.close();
  } catch(err) {
    console.log(err);
    mongoose.connection.close();
  }
};

seedUser();
