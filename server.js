const express = require("express");
const bodyParser = require("body-parser");
const {
  signup,
  login,
  farm,
  worker,
  user,
  tagGroup,
  tag,
  reports,
} = require("./src/routes");
const { passport } = require("./src/passportAuth");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(passport.initialize());

app.use("/signup", signup);

app.use("/login", login);

app.use("/farm", farm);

app.use("/worker", worker);

app.use("/user", user);

app.use("/tag-group", tagGroup);

app.use("/tag", tag);

app.use("/reports", reports);

app.listen(3030, function () {
  console.log("Example app listening on port 3030!");
});
