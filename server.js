const express = require("express");

const bodyParser = require("body-parser");

const signup = require("./src/routes/signup");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Start the server
app.get("/", function (req, res) {
  res.send("Hello World!");
});

app.use("/signup", signup);

app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});
