const passport = require("passport");
const passportJWT = require("passport-jwt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

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
let strategy = new JwtStrategy(jwtOptions, (jwt_payload, next) => {
  console.log("payload received", jwt_payload);
  let user = getUser({ id: jwt_payload.id });
  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
});

// use the strategy
passport.use(strategy);

module.exports = { passport, jwtOptions, jwt };
