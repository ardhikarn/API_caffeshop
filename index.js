require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const routerNavigation = require("./src/index");
const cors = require("cors");

const app = express();
app.use(cors());
// middleware
app.use(bodyParser.json()); //utk row
app.use(bodyParser.urlencoded({ extended: false })); //utk urlencoded
app.use(morgan("dev"));
app.use((request, response, next) => {
  response.header("Access-Control-Allow-Origin", "*");
  response.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Request-With, Content-Type, Accept, Authorization"
  );
  next();
});

app.use("/", routerNavigation);

app.get("*", (request, response) => {
  response.status(404).send("Path Not Found");
});

app.listen(3000, "127.0.0.1", () => {
  console.log("App is Running on host: 127.0.0.1 and port: 3000");
});
