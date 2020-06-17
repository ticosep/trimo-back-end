const express = require("express");
const router = express.Router();
const { passport, STRATEGYS } = require("../services/passportAuth");
const { query } = require("../services/database");

router.get(
  "/",
  passport.authenticate(STRATEGYS.USER, { session: false }),
  async (request, res) => {
    try {
      res.status(200).json({ user: request.user });
      return;
    } catch (error) {
      res.status(404).json({ error });
      return;
    }
  }
);

router.put(
  "/edit",
  passport.authenticate(STRATEGYS.USER, { session: false }),
  async (request, res) => {
    const { user_id, name, surname } = request.body;
    const { id } = request.user;

    const isValid = !!name && !!surname && !!email && !!password;

    if (!isValid || +id !== +user_id) {
      res.sendStatus(400);
      return;
    }

    try {
      await query(`USE core`);

      await query(
        `UPDATE users SET name = '${name}', surname = '${surname}'  WHERE id = ${id}`
      );

      res.sendStatus(200);
      return;
    } catch (error) {
      res.status(404).json({ error });
      return;
    }
  }
);

module.exports = router;
