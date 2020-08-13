const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { request, response } = require("express");

// middleware
app.use(bodyParser.json()); //utk row
app.use(bodyParser.urlencoded({ extended: false })); //utk urlencoded

app.use(morgan("dev"));

app.get("*", (request, response) => {
  response.status(404).send("Path Not Found");
});

app.listen(3000, "127.0.0.1", () => {
  console.log("App is Running on host: 127.0.0.1 and port: 3000");
});
