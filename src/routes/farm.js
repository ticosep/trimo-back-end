const express = require("express");
const router = express.Router();
const { passport, STRATEGYS } = require("../services/passportAuth");

const {
  createFarm,
  getMapFeatures,
  setMapFeatures,
} = require("../models/farm");

// Create a new farm
router.post(
  "/create",
  passport.authenticate(STRATEGYS.USER, { session: false }),
  (request, res) => {
    const { name, production, user_id, user_name, user_surname } = request.body;

    const isValid =
      !!name && !!production && !!user_id && !!user_name && !!user_surname;

    if (!isValid) {
      res.sendStatus(400);
      return;
    }

    try {
      createFarm({ name, production, user_id, user_name, user_surname }, res);
      return;
    } catch (error) {
      res.status(404).json({ error });
      return;
    }
  }
);

router.put(
  "/map/:farm_id",
  passport.authenticate(STRATEGYS.USER, { session: false }),
  (request, res) => {
    const farm_id = request.params.farm_id;
    const { farms } = request.user;
    const { map_features } = request.body;

    const hasAccessToFarm = farms.some((farm) => +farm === +farm_id);

    const isValid = !!farm_id && hasAccessToFarm;

    if (!isValid) {
      res.sendStatus(400);
      return;
    }

    try {
      setMapFeatures({ farm_id, map_features }, res);
      return;
    } catch (error) {
      res.status(404).json({ error });
      return;
    }
  }
);

router.get(
  "/map/:farm_id",
  passport.authenticate(STRATEGYS.USER, { session: false }),
  async (request, res) => {
    const farm_id = request.params.farm_id;
    const { farms } = request.user;

    const hasAccessToFarm = farms.some((farm) => +farm === +farm_id);

    const isValid = !!farm_id && hasAccessToFarm;

    if (!isValid) {
      res.sendStatus(400);
      return;
    }

    try {
      getMapFeatures({ farm_id }, res);
      return;
    } catch (error) {
      res.status(404).json({ error });
      return;
    }
  }
);

module.exports = router;
