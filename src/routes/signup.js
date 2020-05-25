const { database } = require("../database");
const express = require("express");
const { createUser } = require("../models/user");
const router = express.Router();

// Set the databse conection to use the user DB
database.query("USE user", (err, result) => {
  if (err) throw err;
});

// Try to create a new user in the database, if email allreay reponse a error code
router.post("/", (request, res) => {
  try {
    const { name, surname, email, password } = request.body;

    const isValid = !!name && !!surname && !!email && !!password;

    if (!isValid) res.sendStatus(400);

    try {
      const query = createUser({ name, surname, email, password });

      query.on("error", (err) => {
        res.status(401).json({ msg: "Email ja cadastrado!" });
      });

      query.on("result", () => res.sendStatus(200));
    } catch (error) {
      res.sendStatus(400);
    }
  } catch (error) {
    res.sendStatus(400);
  }
});

module.exports = router;
