const express = require("express");
const router = express.Router();
const { passport, STRATEGYS, jwtOptions, jwt } = require("../passportAuth");

const { createFarm } = require("../models/farm");

const handleCreateFarm = (token, password, res) => {
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

// Create a new farm
router.post(
  "/create",
  passport.authenticate(STRATEGYS.USER, { session: false }),
  (request, res) => {
    const { name, production, user_id, user_name, user_surname } = request.body;

    const isValid =
      !!name && !!production && !!user_id && !!user_name && !!user_surname;

    if (!isValid) res.sendStatus(400);

    try {
      createFarm({ name, production, user_id, user_name, user_surname }, res);
    } catch (error) {
      res.status(404).json({ error });
    }
  }
);

module.exports = router;
