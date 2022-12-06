const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/email");
const { token } = require("morgan");
const crypto = require("crypto");

// const { promisify } = require("util");
exports.signUp = async (req, res, next) => {
  //   const newUser = await User.create(req.body); //用户权限太大
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  //参数：payload，密令，options
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
};

exports.login = async (req, res, next) => {
  //   const email = req.body.email;
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("xxx");
  }

  const user = await User.findOne({ email: email }).select("+password");
  console.log(user);

  if (!user || !(await user.correctPassword(password, user.password))) {
    return res.status(401).send("xxx2");
  }

  const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  res.status(200).json({
    status: "success",
    token,
  });
};

exports.protect = async (req, res, next) => {
  // 1.get token
  let token;
  let decoded;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  console.log(token);

  if (!token) {
    return res.status(401).send("you are not login");
  }
  // 2.verification token
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
  } catch (err) {
    console.log(err);
    return res.status(401).send("you are not login");
  }

  //3.check if user still exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return res.status(401).send("user not find");
  }

  //4.check if user change password
  //pass

  req.user = freshUser;

  next();
};

//权限管理
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).send("没有权限");
    }
    next();
  };
};

exports.forgotPassword = async (req, res, next) => {
  //get user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).send("你还没有注册");
  }
  //生成重置密码token
  const resetToken = user.createPasswordResetToken();
  //保存到数据库
  await user.save({ validateBeforeSave: false });
  console.log(resetToken);
  // send token
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  console.log(resetURL);

  const message = "patch this url" + resetURL;

  // await sendEmail({
  //   email: user.email,
  //   subject: "resetpassword",
  //   message,
  // });

  res
    .status(200)
    .json({ status: "success", message: "token send to your email" });
};

exports.resetPassword = async (req, res, next) => {
  // get user based on token
  const token = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  console.log(token);
  const user = await User.findOne({
    passwordResetToken: token,
    ///////////////// // passwordResetTokenExpires: { $gt: Date.now() },
  });
  //果然token没有过期，就重置密码
  if (!user) {
    return res.status(400).send("worng!");
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;

  await user.save();
  res.status(200).json({ status: "success", message: "seccess" });
};
