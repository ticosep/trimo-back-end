const express = require("express");
const router = express.Router();
const { passport, STRATEGYS } = require("../passportAuth");
const { createWorker, editWorker, deleteWorker } = require("../models/worker");
const { validateFarmOperation } = require("../models/farm");

// Create a new worker under the farm id
router.post(
  "/create",
  passport.authenticate(STRATEGYS.USER, { session: false }),
  async (request, res) => {
    const { farm_id, name, surname, type } = request.body;
    const { can_create_worker } = request.user;

    const hasAccessToFarm = await validateFarmOperation({
      farm_id,
      user: request.user,
    });

    const isValid =
      !!name && !!farm_id && !!surname && can_create_worker && hasAccessToFarm;

    if (!isValid) {
      res.sendStatus(400);
      return;
    }

    try {
      createWorker({ farm_id, type, name, surname }, res);
    } catch (error) {
      res.status(404).json({ error });
      return;
    }
  }
);

router.post(
  "/edit",
  passport.authenticate(STRATEGYS.USER, { session: false }),
  async (request, res) => {
    const { farm_id, worker_id, type, name, surname } = request.body;
    const { can_create_worker } = request.user;

    const hasAccessToFarm = await validateFarmOperation({
      farm_id,
      user: request.user,
    });

    const isValid =
      !!name && !!surname && !!type && can_create_worker && hasAccessToFarm;

    if (!isValid) {
      res.sendStatus(400);
      return;
    }

    try {
      editWorker({ farm_id, worker_id, type, name, surname }, res);
    } catch (error) {
      res.status(404).json({ error });
    }
  }
);

router.post(
  "/remove",
  passport.authenticate(STRATEGYS.USER, { session: false }),
  async (request, res) => {
    const { farm_id, worker_id } = request.body;
    const { can_create_worker } = request.user;

    const hasAccessToFarm = await validateFarmOperation({
      farm_id,
      user: request.user,
    });

    const isValid = can_create_worker && hasAccessToFarm;

    if (!isValid) {
      res.sendStatus(400);
      return;
    }

    try {
      deleteWorker({ farm_id, worker_id }, res);
      return;
    } catch (error) {
      res.status(404).json({ error });
      return;
    }
  }
);

module.exports = router;
