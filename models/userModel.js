const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
//指定数据模型
const user = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "we need your name"],
  },
  phone: String,
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
  //   passwordChangedAt: Date,
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

//创建模型
const User = mongoose.model("user", user);
module.exports = User;
