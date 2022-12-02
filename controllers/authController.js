const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
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
