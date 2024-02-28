const mongoose = require("mongoose");
const validator = require("validator");
const bycript = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your name"],
    maxLength: [30, "Name should be 30 char long only"],
    minLength: [4, "Name should atleast 4 char"],
  },
  email: {
    type: String,
    required: [true, "Please enter Email"],
    unique: true,
    validate: [validator.isEmail, "Please Enter valid Email"],
  },
  password: {
    type: String,
    required: [true, "Please Enter the password"],
    minLength: [8, "password should be greather than  8 char"],
    select: false,
  },

  cart_id: {
    type: mongoose.Schema.ObjectId,
    ref: "Cart",
  },
  role: {
    type: String,
    default: "user",
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bycript.hash(this.password, 10);
});

//JWT TOKEN

userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

//compare password

userSchema.methods.comparePassword = async function (enterPassword) {
  console.log("which password you are comparing", enterPassword);
  return await bycript.compare(enterPassword, this.password);
};

//generating password Token

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 15 * 60 * 60 * 1000;
  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
