const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser")
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const jwt = require("jsonwebtoken");
const app = express();
const server = createServer(app);
const userRoutes = require("./routes/userRoute");
const postRoutes = require("./routes/postRoute");
const commentRoutes = require("./routes/commentRoute");
const PORT = process.env.PORT || 3000;
const io = new Server(server,{
  cors:{
    origin: ["http://localhost:5173","http://localhost:3000", "http://127.0.0.1:5173","https://odinbook-fsz2.onrender.com"],
    credentials: true,
  }
});
require("./webSockets/requestSocket")(io);

app.use(
  cors({
    origin: ["http://localhost:5173","http://localhost:3000", "http://127.0.0.1:5173","https://odinbook-fsz2.onrender.com"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use("/user",userRoutes);
app.use("/posts",postRoutes);
app.use("/comments",commentRoutes);
app.use(express.static(path.join(__dirname, "client", "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

server.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`); 
});