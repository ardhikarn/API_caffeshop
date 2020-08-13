const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "caffe-shop",
});

connection.connect((error) => {
  if (error) {
    throw error;
  }
  console.log("Data is Connected Database");
});

module.exports = connection;
