const express = require("express");
const { query } = require("../database");
const router = express.Router();
const { jwtOptions, jwt } = require("../passportAuth");
const { decodeAppCode } = require("../crypto");

const handleLogin = async (user, password, res) => {
  if (user.password === password) {
    // from now on we’ll identify the user by the id and the id is
    // the only personalized value that goes into our token
    let farms = [];

    try {
      await query("USE core");

      const farmsQuery = await query(`SELECT *
      FROM users
      INNER JOIN farm_users
      ON users.id = farm_users.user_id
      WHERE users.id = ${user.id};`);

      if (farmsQuery.length) {
        farms = farmsQuery.map(({ farm }) => farm);
      }

      let payload = {
        user: Object.assign({}, user, {
          is_worker: false,
          is_owner: true,
          farms,
          can_create_worker: true,
          can_create_tags: true,
        }),
      };

      const token = jwt.sign(payload, jwtOptions.secretOrKey);
      res.json({ msg: "ok", token: token });
    } catch (error) {
      res.status(400).json({ msg: "Error SQL" });
    }
  } else {
    res.status(401).json({ msg: "Senha incorreta!" });
  }
};

const handleCodeLogin = async (farm_id, user_id, res) => {
  let payload = {};

  try {
    await query(`USE farm_${farm_id}`);

    const userInfo = await query(
      `SELECT * FROM workers WHERE id = ${+user_id};`
    );

    if (userInfo) {
      const user = {
        id: +user_id,
        is_worker: true,
        can_create_worker: !!userInfo.type,
        can_create_tags: !!userInfo.type,
        farms: [farm_id],
        name: userInfo.name,
        surname: userInfo.surname,
      };

      payload = Object.assign({}, payload, { user });
    }

    let token = jwt.sign(payload, jwtOptions.secretOrKey);
    res.json({ msg: "ok", token: token });
  } catch (error) {
    res.status(400).json({ msg: "Error SQL" });
  }
};

router.post("/", async (request, res) => {
  const { email, password } = request.body;

  const isValid = !!email && !!password;

  if (!isValid) {
    res.sendStatus(400);
    return;
  }

  try {
    await query("USE core");

    const [user] = await query(`SELECT * FROM users WHERE email = '${email}'`);

    if (!user) {
      res.status(401).json({ msg: "Usuario nao cadastrado" });

      return;
    }

    await handleLogin(user, password, res);
  } catch (error) {
    console.log(error);
    res.status(404).json({ error });
    return;
  }
});

router.post("/code", async (request, res) => {
  const { appkey } = request.body;

  const isValid = !!appkey;

  if (!isValid) {
    res.sendStatus(400);
    return;
  }

  const info = decodeAppCode(appkey);
  const [farm_id, user_id] = info.split("/");

  try {
    await handleCodeLogin(farm_id, user_id, res);
    return;
  } catch (error) {
    res.status(404).json({ error });
    return;
  }
});

module.exports = router;
