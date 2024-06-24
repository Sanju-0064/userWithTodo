const express = require("express");
const app = express();
const http = require("http");
const mongoose = require("mongoose");
const PORT = 5000;
const bodyParser = require("body-parser");

const server = http.createServer(app);

mongoose
  .connect("mongodb://127.0.0.1:27017/interview", {})
  .then((res) => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log("error occurred in db", err);
  });

app.use(bodyParser.json());

app.use(require("./routes"));
server.listen(PORT, () => {
  console.log(`server listening on port : ${PORT}`);
});
