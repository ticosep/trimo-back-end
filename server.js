const express = require("express");
const bodyParser = require("body-parser");
const { signup, login, farm, worker } = require("./src/routes");
const { passport, STRATEGYS } = require("./src/passportAuth");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(passport.initialize());

app.use("/signup", signup);

app.use("/login", login);

app.use("/farm", farm);

app.use("/worker", worker);

app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});
