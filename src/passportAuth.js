const passport = require("passport");
const passportJWT = require("passport-jwt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { getUserById } = require("./models/user");

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
// TODO: Add falg to use worker validation
let userStrategy = new JwtStrategy(jwtOptions, (jwt_payload, next) => {
  getUserById({ id: jwt_payload.id }, (error, user) => {
    if (error) next(null, false);

    if (user) {
      next(null, user);
    } else {
      next(null, false);
    }
  });
});

// use the strategy
passport.use(STRATEGYS.USER, userStrategy);

module.exports = { passport, STRATEGYS, jwtOptions, jwt };
