const passport = require("passport");
const passportJWT = require("passport-jwt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

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
    const appUser = {
      id: jwt_payload.user.id,
      is_worker: false,
      is_owner: true,
      can_create_worker: true,
    };

    next(null, appUser);
  }

  if (jwt_payload.is_worker) {
    const appUser = {
      id: jwt_payload.id,
      is_worker: true,
      can_create_worker: !!user.type,
      farm_id: jwt_payload.farm_id,
    };

    next(null, appUser);
  }
});

// use the strategy
passport.use(STRATEGYS.USER, userStrategy);

module.exports = { passport, STRATEGYS, jwtOptions, jwt };
