const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser")
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const jwt = require("jsonwebtoken");
const app = express();
const server = createServer(app);
const io = new Server(server,{
  cors:{
    origin: ["http://localhost:5173","http://localhost:3000", "http://127.0.0.1:5173"],
    credentials: true,
  }
});

app.use(
  cors({
    origin: ["http://localhost:5173","http://localhost:3000", "http://127.0.0.1:5173"],
    credentials: true,
  })
);

app.use(express.json());

app.use(cookieParser());

server.listen(3000, () => {
  console.log(`Listening to port 3000`); 
});