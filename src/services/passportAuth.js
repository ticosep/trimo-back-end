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

const getDefaultUser = async (user) => {
  let farms = [];

  try {
    await query("USE core");

    const userQuery = await query(`
    SELECT *
    FROM users
    INNER JOIN farm_users
    ON users.id = farm_users.user_id
    WHERE users.id = ${user.id};`);

    if (userQuery.length) {
      farms = userQuery.map(({ farm }) => farm);
    }

    user = Object.assign({}, user, {
      farms,
    });

    return user;
  } catch (error) {
    console.log("Error SQL");
  }
};

// lets create our strategy for web token
let userStrategy = new JwtStrategy(jwtOptions, async (jwt_payload, next) => {
  if (jwt_payload.user) {
    if (!jwt_payload.user.is_worker) {
      const user = await getDefaultUser(jwt_payload.user);
      next(null, user);
    }
  } else {
    next(null, false);
  }
});

// use the strategy
passport.use(STRATEGYS.USER, userStrategy);

module.exports = { passport, STRATEGYS, jwtOptions, jwt };
