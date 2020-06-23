const express = require("express");
const router = express.Router();
const { passport, STRATEGYS } = require("../services/passportAuth");

const {
  createFarm,
  getMapFeatures,
  setMapFeatures,
} = require("../models/farm");
const { query } = require("../services/database");

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
  "/user",
  passport.authenticate(STRATEGYS.USER, { session: false }),
  async (request, res) => {
    const { id, farms, is_worker } = request.user;

    try {
      await query("USE core");

      const [farm] = farms;

      if (is_worker) {
        const info = await query(`
        SELECT * FROM farms 
        WHERE id = ${farm}        
        `);

        res.status(200).json({ farms: info });
      }

      if (!is_worker) {
        const farms = await query(`
        SELECT * FROM farms AS A
        INNER JOIN farm_users AS B
        ON A.id = B.farm
        WHERE B.user_id = ${id}
        `);

        res.status(200).json({ farms });
      }

      return;
    } catch (error) {
      res.status(404).json({ error });
      return;
    }
  }
);

module.exports = router;
