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

const express = require("express");
const app = express();
app.get("/", (req, res) => {
  res.status(200).json({ id: 1, name: "zj", age: 26 });
});
app.listen(8000, () => {
  console.log("app running on port 8000");
});
