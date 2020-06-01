const express = require("express");
const { query } = require("../database");
const router = express.Router();
const { jwtOptions, jwt } = require("../passportAuth");
const { decodeAppCode } = require("../crypto");

const { getUserByEmail } = require("../models/user");

const handleLogin = (user, password, res) => {
  if (user.password === password) {
    // from now on we’ll identify the user by the id and the id is
    // the only personalized value that goes into our token
    let payload = { user: user, is_worker: false };

    let token = jwt.sign(payload, jwtOptions.secretOrKey);
    res.json({ msg: "ok", token: token });
  } else {
    res.status(401).json({ msg: "Senha incorreta!" });
  }
};

const handleCodeLogin = (farm_id, user_id, res) => {
  let payload = { id: +user_id, is_worker: true, farm_id: +farm_id };

  let token = jwt.sign(payload, jwtOptions.secretOrKey);
  res.json({ msg: "ok", token: token });
};

router.post("/", async (request, res) => {
  const { email, password } = request.body;

  const isValid = !!email && !!password;

  if (!isValid) {
    res.sendStatus(400);
    return;
  }

  await query("USE user");

  try {
    getUserByEmail({ email }, (error, result) => {
      if (error) {
        res.status(401).json({ error });

        return;
      }

      if (!result.length) {
        res.status(401).json({ msg: "Usuario nao cadastrado" });

        return;
      }

      const user = result[0];

      handleLogin(user, password, res);

      return;
    });
  } catch (error) {
    res.status(404).json({ error });
    return;
  }
});

router.post("/code", async (request, res) => {
  const { appkey } = request.body;

  const isValid = !!appkey;

  if (!isValid) res.sendStatus(400);

  const info = decodeAppCode(appkey);
  const [farm_id, user_id] = info.split("/");

  try {
    handleCodeLogin(farm_id, user_id, res);
    return;
  } catch (error) {
    res.status(404).json({ error });
    return;
  }
});

module.exports = router;
