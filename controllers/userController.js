require("dotenv").config();
const bcrypt = require("bcryptjs");
const queries = require("../database/userQueries");
const jwt = require("jsonwebtoken");

async function register(req, res) {
  const user = await createUser(req.body);

  let created = '';
  try {
    created = await queries.createUser(user);
    res.status(201).json({
    message:"Created user!"
    })}catch (error) {
      if(error.code === "P2002"){
        res.status(400).json({
          message:"Someone with this email is already registered!",
          error: error,
        })
      }
    }
}

async function login(req, res) {

  const found = await queries.userFound(req.body);

  if (found === null) return res.sendStatus(403);
  const user = {
    id: found.id,
    firstname: found.firstname,
    lastname: found.lastname,
    email: found.email,
    author:found.author,
  };
  console.log(user);
  if (found !== null) {
    try {
      jwt.sign({ user: user }, process.env.secret,{ expiresIn: '1h' }, (err, token) => {
      res.cookie("auth_jwt", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 60 * 60 * 1000,
      });
      console.log(token);
      res.json({token,});
      });
    }catch (error) {
      console.log(error);
      next(error);
    }
   } 
   else res.sendStatus(403);
}

async function createUser(body) {
  const hashedPassword = await bcrypt.hash(body.password, 10);
  const user = {
    firstname: body.firstname,
    lastname: body.lastname,
    email: body.email,
    password: hashedPassword,
  };
  return user;
}


  module.exports = {
    register,
    login,
  };
  