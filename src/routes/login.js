const express = require("express");
const { query } = require("../database");
const router = express.Router();
const { jwtOptions, jwt } = require("../passportAuth");

const { getUserByEmail } = require("../models/user");

const handleLogin = (user, password, res) => {
  if (user.password === password) {
    // from now on we’ll identify the user by the id and the id is
    // the only personalized value that goes into our token
    let payload = { id: user.idusers };

    let token = jwt.sign(payload, jwtOptions.secretOrKey);
    res.json({ msg: "ok", token: token });
  } else {
    res.status(401).json({ msg: "Senha incorreta!" });
  }
};

// Try to create a new user in the database, if email allreay reponse a error code
router.post("/", async (request, res) => {
  const { email, password } = request.body;

  const isValid = !!email && !!password;

  if (!isValid) res.sendStatus(400);

  await query("USE user");

  try {
    getUserByEmail({ email }, (error, result) => {
      if (error) res.status(401).json({ error });

      if (!result.length) {
        res.status(401).json({ msg: "Usuario nao cadastrado" });

        return;
      }

      const user = result[0];
      handleLogin(user, password, res);
    });
  } catch (error) {
    res.status(404).json({ error });
  }
});

module.exports = router;
