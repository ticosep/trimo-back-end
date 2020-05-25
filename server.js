const express = require("express");
const bodyParser = require("body-parser");
const { signup, login, farm } = require("./src/routes");
const { passport, STRATEGYS } = require("./src/passportAuth");

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

app.use("/farm", farm);

app.get(
  "/protected",
  passport.authenticate(STRATEGYS.USER, { session: false }),
  (req, res) => {
    res.json("Success! You can now see this without a token.");
  }
);

app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});
