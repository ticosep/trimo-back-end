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

const { passport, jwt, jwtOptions } = require("./src/services/passportAuth");
const { query } = require("./src/services/database");

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

app.get("/confirmation/:token", async (req, res) => {
  try {
    const verif = jwt.verify(req.params.token, jwtOptions.secretOrKey);

    await query(`USE core`);

    await query(`UPDATE users SET validated = 1 WHERE id = ${verif.id}`);
  } catch (e) {
    res.send("error");
  }

  return res.redirect("http://localhost:3000/login");
});

app.listen(3030, function () {
  console.log("Example app listening on port 3030!");
});
