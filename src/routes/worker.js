// Create a new farm
router.post(
  "/create",
  passport.authenticate(STRATEGYS.USER, { session: false }),
  (request, res) => {
    const { name, production, user_id } = request.body;

    const isValid = !!name && !!production && user_id;

    if (!isValid) res.sendStatus(400);

    try {
      createFarm({ name, production, user_id }, res);
    } catch (error) {
      res.status(404).json({ error });
    }
  }
);

module.exports = router;
