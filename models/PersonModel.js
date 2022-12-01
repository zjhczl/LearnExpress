const mongoose = require("mongoose");
//指定数据模型
const person = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: Number,
  info: String,
  tag: { type: String, default: "vv1" },
});
//创建模型
const Person = mongoose.model("person", person);
module.exports = Person;
