const express = require("express");
const router = express.Router();
const { passport, STRATEGYS } = require("../services/passportAuth");
const {
  createWorker,
  editWorker,
  deleteWorker,
  getWorkers,
} = require("../models/worker");

router.get(
  "/:farm_id",
  passport.authenticate(STRATEGYS.USER, { session: false }),
  async (request, res) => {
    const farm_id = request.params.farm_id;

    const { can_create_worker, farms } = request.user;

    const hasAccessToFarm = farms.some((farm) => +farm === +farm_id);

    const isValid = can_create_worker && hasAccessToFarm;

    if (!isValid) {
      res.sendStatus(400);
      return;
    }

    try {
      await getWorkers({ farm_id }, res);
      return;
    } catch (error) {
      res.status(404).json({ error });
      return;
    }
  }
);

// Create a new worker under the farm id
router.post(
  "/create",
  passport.authenticate(STRATEGYS.USER, { session: false }),
  async (request, res) => {
    const { farm_id, name, surname, type } = request.body;
    const { can_create_worker, farms } = request.user;

    const hasAccessToFarm = farms.some((farm) => +farm === +farm_id);

    const isValid =
      !!name && !!farm_id && !!surname && can_create_worker && hasAccessToFarm;

    if (!isValid) {
      res.sendStatus(400);
      return;
    }

    try {
      await createWorker({ farm_id, type, name, surname }, res);
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
    const { farm_id, worker_id, type, name, surname } = request.body;
    const { can_create_worker, farms } = request.user;

    const hasAccessToFarm = farms.some((farm) => +farm === +farm_id);

    const isValid =
      !!name && !!surname && !!type && can_create_worker && hasAccessToFarm;

    if (!isValid) {
      res.sendStatus(400);
      return;
    }

    try {
      await editWorker({ farm_id, worker_id, type, name, surname }, res);
      return;
    } catch (error) {
      res.status(404).json({ error });
    }
  }
);

router.delete(
  "/remove",
  passport.authenticate(STRATEGYS.USER, { session: false }),
  async (request, res) => {
    const { farm_id, worker_id } = request.body;
    const { can_create_worker, farms } = request.user;

    const hasAccessToFarm = farms.some((farm) => +farm === +farm_id);

    const isValid = can_create_worker && hasAccessToFarm;

    if (!isValid) {
      res.sendStatus(400);
      return;
    }

    try {
      await deleteWorker({ farm_id, worker_id }, res);
      return;
    } catch (error) {
      res.status(404).json({ error });
      return;
    }
  }
);

module.exports = router;
