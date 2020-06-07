const passport = require("passport");
const passportJWT = require("passport-jwt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { query } = require("./database");

const STRATEGYS = {
  USER: "user-rule",
};

// Config dotenv to get access to the variables
dotenv.config();

// ExtractJwt to help extract the token
let ExtractJwt = passportJWT.ExtractJwt;

// JwtStrategy which is the strategy for the authentication
let JwtStrategy = passportJWT.Strategy;
let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = process.env.PASSPORT_KEY;

// lets create our strategy for web token
let userStrategy = new JwtStrategy(jwtOptions, async (jwt_payload, next) => {
  if (!jwt_payload.is_worker) {
    await query("USE user");

    const user = await query(`SELECT *
    FROM users
    INNER JOIN farm_users
    ON users.id = farm_users.user_id
    WHERE users.id = ${jwt_payload.user.id};`);

    if (user.length) {
      const farms = user.map(({ farm }) => farm);

      const appUser = {
        id: jwt_payload.user.id,
        is_worker: false,
        is_owner: true,
        farms,
        can_create_worker: true,
        can_create_tags: true,
        name: jwt_payload.user.name,
        surname: jwt_payload.user.surname,
        email: jwt_payload.user.email,
      };

      next(null, appUser);
    } else {
      next(null, {});
    }
  }

  if (jwt_payload.is_worker) {
    await query(`USE farm_${jwt_payload.farm_id}`);

    const user = await query(
      `SELECT * FROM workers WHERE id = ${jwt_payload.id};`
    );

    if (user.length) {
      const appUser = {
        id: jwt_payload.id,
        is_worker: true,
        can_create_worker: !!user.type,
        can_create_tags: !!user.type,
        farms: [jwt_payload.farm_id],
        name: user.name,
        surname: user.surname,
      };

      next(null, appUser);
    } else {
      next(null, {});
    }
  }
});

// use the strategy
passport.use(STRATEGYS.USER, userStrategy);

module.exports = { passport, STRATEGYS, jwtOptions, jwt };
