const mysql = require("mysql");
const dotenv = require("dotenv");

// Config dotenv to get access to the variables
dotenv.config();

// Connect to the DB
const database = mysql.createConnection({
  host: process.env.HOST,
  port: process.env.PORT,
  user: process.env.USER,
  password: process.env.PASSWORD,
});

database.connect((err) => {
  if (err) return console.log(err);
  console.log("conectou!");
});

module.exports = database;
