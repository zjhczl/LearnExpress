const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
//指定数据模型
const user = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "we need your name"],
  },
  phone: String,
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  email: {
    type: String,
    required: [true, "we need your email"],
    unique: true,
    lowercase: true,
    validator: [validator.isEmail, "pleace provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "pleace provide a password"],
    minlength: 8,
    select: false, //不让它发送给客户
  },
  passwordConfirm: {
    type: String,
    required: [true, "pleace confirm that your password is correct "],
    //this only works on save!
    validator: function (el) {
      return el === this.password;
    },
    message: "password are not the same",
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetTokenExpires: Date,
});

//密码加密
user.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

//验证密码是否正确
user.methods.correctPassword = async function (password, userPassword) {
  return await bcrypt.compare(password, userPassword);
};

//验证是否更改密码
user.methods.changePassword = async function (password, userPassword) {
  return await bcrypt.compare(password, userPassword);
};

//生成密码重置token
user.methods.createPasswordResetToken = function () {
  //创建一个字符串
  const resetToken = crypto.randomBytes(32).toString("hex");
  //加密储存到数据库
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
  // this.save();
  return resetToken;
};

//创建模型
const User = mongoose.model("user", user);
module.exports = User;
