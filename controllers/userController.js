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

async function profileUpload(req,res){
  console.log(req.file);
  const { createClient } = await import('@supabase/supabase-js');
  const { decode } = await import('base64-arraybuffer');
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.secret
  );
  const base64Data = req.file.buffer.toString('base64');
  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(`${req.body.user.id}/profilePicture`, decode(base64Data),{ contentType: 'image/png' })

  if(error) res.status(500).json({error:error.message});
  else res.status(200).json(data);
}

async function profilePictureUpdate(req,res){
  const { createClient } = await import('@supabase/supabase-js');
  const { decode } = await import('base64-arraybuffer');
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.secret
  );
  const base64Data = req.file.buffer.toString('base64');
  const { data, error } = await supabase.storage.from('avatars').update(`${req.body.user.id}/profilePicture`, decode(base64Data),{cacheControl: '3600',upsert: true})
  if(error) res.status(500).json({error:error.message});
  else res.status(200).json(data);
}

async function getUser(req,res){
  const user = await queries.retrieveUser(parseInt(req.params.userId));
  console.log(user);
  return res.json(user);
}

 async function friendList(req,res){
  let user ={
    id:req.params.id,
  };
  let list = await queries.friendList(user);
  console.log(list);
  return res.json(list);
}

  module.exports = {
    register,
    login,
    profileUpload,
    profilePictureUpdate,
    getUser,
    friendList
  };
  