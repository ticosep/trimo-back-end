const express = require("express");
const router = express.Router();
const { passport, STRATEGYS } = require("../passportAuth");
const { createReport, deleteReport, getReports } = require("../models/report");

router.get(
  "/:farm_id",
  passport.authenticate(STRATEGYS.USER, { session: false }),
  async (request, res) => {
    const farm_id = request.params.farm_id;
    const { farms } = request.user;

    const hasAccessToFarm = farms.some((farm) => +farm === +farm_id);

    const isValid = hasAccessToFarm;

    if (!isValid) {
      res.sendStatus(400);
      return;
    }

    try {
      await getReports({ farm_id }, res);
      return;
    } catch (error) {
      res.status(404).json({ error });
      return;
    }
  }
);

router.post(
  "/create",
  passport.authenticate(STRATEGYS.USER, { session: false }),
  async (request, res) => {
    const {
      farm_id,
      tag_id,
      worker_id,
      latidute,
      longitude,
      accuracy,
    } = request.body;
    const { can_create_tags, farms } = request.user;

    const hasAccessToFarm = farms.some((farm) => +farm === +farm_id);

    const isValid =
      !!farm_id &&
      !!tag_id &&
      !!worker_id &&
      !!latidute &&
      !!longitude &&
      !!accuracy &&
      hasAccessToFarm;

    if (!isValid) {
      res.sendStatus(400);
      return;
    }

    try {
      createReport(
        { farm_id, tag_id, worker_id, latidute, longitude, accuracy },
        res
      );
    } catch (error) {
      res.status(404).json({ error });
      return;
    }
  }
);

router.delete(
  "/remove",
  passport.authenticate(STRATEGYS.USER, { session: false }),
  async (request, res) => {
    const { farm_id, report_id } = request.body;
    const { farms } = request.user;

    const hasAccessToFarm = farms.some((farm) => +farm === +farm_id);

    const isValid = !!report_id && hasAccessToFarm && !!farm_id;

    if (!isValid) {
      res.sendStatus(400);
      return;
    }

    try {
      deleteReport({ farm_id, report_id }, res);
      return;
    } catch (error) {
      res.status(404).json({ error });
      return;
    }
  }
);

module.exports = router;
