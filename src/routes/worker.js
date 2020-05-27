const express = require("express");
const router = express.Router();
const { passport, STRATEGYS } = require("../passportAuth");
const { createWorker } = require("../models/worker");

// Create a new worker under the farm id
router.post(
  "/create",
  passport.authenticate(STRATEGYS.USER, { session: false }),
  (request, res) => {
    const { farm_id, name, surname, type } = request.body;
    const { can_create_worker } = request.user;

    const isValid = !!name && !!farm_id && !!surname && can_create_worker;

    if (!isValid) res.sendStatus(400);

    try {
      createWorker({ farm_id, type, name, surname }, res);
    } catch (error) {
      res.status(404).json({ error });
    }
  }
);

module.exports = router;
