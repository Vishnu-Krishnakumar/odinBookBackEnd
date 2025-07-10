const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const queries = require("../database/userQueries");
const bcrypt = require("bcryptjs");
const jwtStrategy = require("passport-jwt").Strategy;
const extractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");
require("dotenv").config();

const cookieExtractor = (req) => {
  var token = null;
  if (req && req.cookies) {
    token = req.cookies["auth_jwt"];
  }
  return token;
};

const opts = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: process.env.secret,
};

passport.use(
  new jwtStrategy(opts, async (payload, done) => {
    try {
      const found = await queries.userVerify(payload.user);
      if (found) return done(null, payload);
      else return done(null, false);
    } catch (error) {
      return done(error);
    }
  })
);

module.exports = {
  passport,
  cookieExtractor,
};