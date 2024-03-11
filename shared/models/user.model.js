const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  mobile: String,
  username: String,
  password: String,
  role: Number,
});

const userModel = mongoose.model("", userSchema, "user_details");
module.exports = userModel;
