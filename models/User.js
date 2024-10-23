const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  messages: [
    {
      message: {
        type: String,
      },
    },
  ],

  date: {
    type: Date,
    default: Date.now,
  },
});

//hasing the password
UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;
