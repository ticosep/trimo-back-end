const express = require("express");
const bodyParser = require("body-parser");
const { signup, login } = require("./src/routes");
const { passport } = require("./src/passportAuth");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(passport.initialize());

// Start the server
app.get("/", function (req, res) {
  res.send("Hello World!");
});

app.use("/signup", signup);

app.use("/login", login);

app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});
