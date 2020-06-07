const express = require("express");
const router = express.Router();
const { passport, STRATEGYS } = require("../passportAuth");
const { createTag, editTag, deleteTag, getTags } = require("../models/tag");

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
      await getTags({ farm_id }, res);
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
      group_id,
      color,
      tag_desc,
      custom_data,
      name,
    } = request.body;
    const { can_create_tags, farms } = request.user;

    const hasAccessToFarm = farms.some((farm) => +farm === +farm_id);

    const isValid =
      !!name &&
      !!farm_id &&
      !!group_id &&
      !!color &&
      !!tag_desc &&
      can_create_tags &&
      hasAccessToFarm;

    if (!isValid) {
      res.sendStatus(400);
      return;
    }

    try {
      await createTag(
        { farm_id, group_id, color, tag_desc, custom_data, name },
        res
      );

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
    const {
      farm_id,
      group_id,
      tag_id,
      color,
      tag_desc,
      custom_data,
      name,
    } = request.body;
    const { can_create_tags, farms } = request.user;

    const hasAccessToFarm = farms.some((farm) => +farm === +farm_id);

    const isValid =
      !!name &&
      !!farm_id &&
      !!group_id &&
      !!color &&
      !!tag_desc &&
      can_create_tags &&
      hasAccessToFarm;

    if (!isValid) {
      res.sendStatus(400);
      return;
    }

    try {
      await editTag(
        { farm_id, group_id, tag_id, color, tag_desc, custom_data, name },
        res
      );

      return;
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
    const { farm_id, tag_id } = request.body;
    const { can_create_tags, farms } = request.user;

    const hasAccessToFarm = farms.some((farm) => +farm === +farm_id);

    const isValid = can_create_tags && hasAccessToFarm && !!tag_id;

    if (!isValid) {
      res.sendStatus(400);
      return;
    }

    try {
      await deleteTag({ farm_id, tag_id }, res);
      return;
    } catch (error) {
      res.status(404).json({ error });
      return;
    }
  }
);

module.exports = router;
