const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const usersRoute = require("./routes/userRoutes");

const app = express();
dotenv.config();
app.use(express.json());
app.use(cookieParser());

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

app.use("/worko/user", usersRoute);

app.listen(5000, () => {
  connect();
  console.log("backend is running");
});
