const fs = require("fs");
const dotenv = require("dotenv"); // 使用config.env
const mongoose = require("mongoose");
const Person = require("../models/PersonModel");
dotenv.config({ path: "../config.env" }); //加载config.env 到环境变量
//读取数据
const persons = JSON.parse(fs.readFileSync("./data.json", "utf-8"));
//连接数据库
const DB = process.env.DATABASE;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => {
    // console.log(con.connections);
    console.log("mongodb connected!");
    //保存数据
    Person.create(persons).then(() => {
      process.exit();
    });
  });
