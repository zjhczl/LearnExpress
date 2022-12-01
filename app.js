const { toUSVString } = require("util");

function learnPublic() {
  var express = require("express");
  var app = express();
  const cors = require("cors");
  app.use(cors());
  app.use("/public", express.static("public"));

  app.get("/", function (req, res) {
    res.send("Hello World");
  });

  var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log("应用实例，访问地址为 http://localhost:%s", port);
  });
}

function learnMongoDB() {
  var express = require("express");
  var app = express();
  const cors = require("cors");
  app.use(cors());

  const MongoClient = require("mongodb").MongoClient;
  const dburl = "mongodb://localhost:27017";
  MongoClient.connect(dburl, (err, client) => {
    if (err) {
      throw err;
    }

    let db = client.db("zjtest");
    const datas = db.collection("my").find();
    datas.toArray((err, result) => {
      console.log(result);
      client.close();
    });
  });
}

function LearnAPI() {
  const express = require("express");
  const fs = require("fs");
  const app = express();
  const persons = JSON.parse(fs.readFileSync("./data.json", "utf-8"), true);
  //app.route("/api/v1/persons").get(()=>{}).post(()={})
  // 使用get方法获取数据

  //获取全部person
  app.get("/api/v1/persons", (req, res) => {
    res
      .status(200)
      .json({ status: "success", result: persons.length, data: { persons } });
  });
  //获取一个person
  app.get("/api/v1/persons/:id", (req, res) => {
    const id = req.params.id * 1;
    // if (id > persons.length) {
    //   return res.status(404).json({
    //     tatus: "fail",
    //     message: "invalid id",
    //   });
    // }
    const person = persons.find((p) => {
      return p.id == id;
    });
    //person undefind
    if (!person) {
      return res.status(404).json({
        tatus: "fail",
        message: "invalid id",
      });
    }
    res.status(200).json({
      status: "success",
      // result: persons.length,
      data: { person },
    });
  });

  //使用post方法新增数据
  app.use(express.json()); //使用中间件，把参数转到body
  app.post("/api/v1/persons", (req, res) => {
    const newId = persons[persons.length - 1].id + 1;
    const newPerson = { id: newId, ...req.body };
    console.log(newPerson);
    persons.push(newPerson);
    fs.writeFile("./data.json", JSON.stringify(persons), (err) => {
      res.status(200).json({ status: "success", data: { person: newPerson } });
    });
  });
  //使用put方法更新整条数据
  //使用patch方法更新整体数据的部分
  app.patch("/api/v1/persons/:id", (req, res) => {
    res
      .status(200)
      .json({ status: "success", data: { person: "updata success" } });
  });
  //删除一条数据
  app.delete("/api/v1/persons/:id", (req, res) => {
    res.status(204).json({ status: "success", data: null });
  });

  //开启服务
  app.listen(8000, () => {
    console.log("app running on port 8000");
  });
}

function LearnMiddleware() {
  const express = require("express");
  const app = express();
  //自定义中间件
  app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    console.log(req.requestTime);
    next();
  });
  //使用第三方中间件
  //morgan 日志
  const morgan = require("morgan");
  app.use(morgan("dev"));
  //开启服务
  app.listen(8000, () => {
    console.log("app running on port 8000");
  });
}

function learnRouter() {
  const express = require("express");
  const app = express();
  function getAllUsers(req, res) {
    res.send("done");
  }
  function addOneUser(req, res) {
    res.send("done");
  }
  function getUser(req, res) {
    res.send("done");
  }
  function updataUser(req, res) {
    res.send("done");
  }
  function deleteUser(req, res) {
    res.send("done");
  }

  const usersRouter = express.Router();
  usersRouter.route("/").get(getAllUsers).post(addOneUser);
  usersRouter.route("/:id").get(getUser).patch(updataUser).delete(deleteUser);
  app.use("/api/v1/users", usersRouter);
  app.listen(8000, () => {
    console.log("app running on port 8000");
  });
}

/////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
const express = require("express");
const usersRouter = require("./routes/userRoutes");
const personRouter = require("./routes/personRoutes");
const dotenv = require("dotenv"); // 使用config.env
const mongoose = require("mongoose");

dotenv.config({ path: "./config.env" }); //加载config.env 到环境变量

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
  });

// //创建对象
// const testPerson = new Person({ name: "zj", age: 26, info: "sadasdas" });
// testPerson
//   .save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

const app = express();
app.use(express.json()); //使用中间件，把参数转到body
app.use("/api/v1/persons", personRouter);
app.use("/api/v1/users", usersRouter);

//使用环境变量
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`app running on port ${port}`);
});
