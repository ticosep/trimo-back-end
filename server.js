const express = require("express");
const dotenv = require("dotenv");
const mysql = require("mysql");
const app = express();

// Config dotenv to get access to the variables
dotenv.config();

const connection = mysql.createConnection({
  host: process.env.HOST,
  port: process.env.PORT,
  user: process.env.USER,
  password: process.env.PASSWORD,
});

connection.connect((err) => {
  if (err) return console.log(err);
  console.log("conectou!");
});

app.get("/", function (req, res) {
  res.send("Hello World!");
});

app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});
