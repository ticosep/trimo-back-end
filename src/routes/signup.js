const database = require("../database");
const express = require("express");
const router = express.Router();

const ERROR_MESSAGES = {
  "1062": "Duplicate entry 'jose.casemiro@gmail.com' for key email",
};

database.query("USE user", (err, result) => {
  if (err) throw err;
});

router.post("/", (request, res) => {
  try {
    const { name, surname, email, password } = request.body;

    const isValid = !!name && !!surname && !!email && !!password;

    if (!isValid) res.sendStatus(400);

    try {
      const query = database.query(
        `INSERT INTO users (name, surname, email, password) VALUES ('${name}', '${surname}', '${email}', '${password}')`
      );

      query.on("error", () => res.sendStatus(400));

      query.on("result", () => res.sendStatus(200));
    } catch (error) {
      res.sendStatus(400);
    }
  } catch (error) {
    res.sendStatus(400);
  }
});

router.get("/", (request, res) => {
  try {
    database.query("SELECT * FROM users", (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } catch (error) {
    res.sendStatus(404);
  }
});

module.exports = router;
