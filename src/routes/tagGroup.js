const express = require("express");
const router = express.Router();
const { passport, STRATEGYS } = require("../passportAuth");
const {
  createTagGroup,
  editTagGroup,
  deleteTagGroup,
  getGroups,
} = require("../models/tagGroup");

router.get(
  "/:farm_id",
  passport.authenticate(STRATEGYS.USER, { session: false }),
  async (request, res) => {
    const farm_id = request.params.farm_id;
    const { can_create_tags, farms } = request.user;

    const hasAccessToFarm = farms.some((farm) => +farm === +farm_id);

    const isValid = can_create_tags && hasAccessToFarm;

    if (!isValid) {
      res.sendStatus(400);
      return;
    }

    try {
      await getGroups({ farm_id }, res);
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
    const { farm_id, name } = request.body;
    const { can_create_tags, farms } = request.user;

    const hasAccessToFarm = farms.some((farm) => +farm === +farm_id);

    const isValid = !!name && !!farm_id && can_create_tags && hasAccessToFarm;

    if (!isValid) {
      res.sendStatus(400);
      return;
    }

    try {
      await createTagGroup({ farm_id, name }, res);

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
    const { farm_id, group_id, name } = request.body;
    const { can_create_tags, farms } = request.user;

    const hasAccessToFarm = farms.some((farm) => +farm === +farm_id);

    const isValid =
      !!name && !!farm_id && !!group_id && can_create_tags && hasAccessToFarm;

    if (!isValid) {
      res.sendStatus(400);
      return;
    }

    try {
      await editTagGroup({ farm_id, group_id, name }, res);

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
    const { farm_id, group_id } = request.body;
    const { can_create_tags, farms } = request.user;

    const hasAccessToFarm = farms.some((farm) => +farm === +farm_id);

    const isValid = can_create_tags && hasAccessToFarm && !!group_id;

    if (!isValid) {
      res.sendStatus(400);
      return;
    }

    try {
      await deleteTagGroup({ farm_id, group_id }, res);
      return;
    } catch (error) {
      res.status(404).json({ error });
      return;
    }
  }
);

module.exports = router;
