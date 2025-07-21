const userQueries = require("../database/userQueries");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
module.exports = function(io){

  io.use((socket, next) => {
    const { headers, auth } = socket.handshake;
    let token;


    if (headers.cookie) {
      const cookies = cookie.parse(headers.cookie);
      token = cookies.auth_jwt;
    }

 

    if (!token) {
      return next(new Error("No token provided"));
    }

    try {
      const decoded = jwt.verify(token, process.env.secret);
      socket.user = decoded.user; 
      console.log(decoded.user);
      next();
    } catch (err) {
      console.error("JWT Error:", err.message);
      return next(new Error("Invalid token"));
    }
  });

  io.on('connection', async (socket) => {
    let requests = await userQueries.requests({id:1});
    socket.emit(`request-${2}`,requests);
    let list = await userQueries.friendList({id:1});
    socket.emit(`friendList-${2}`,list);
    socket.on('sendRequest',async (socket) =>{
      console.log("test");
      const friendCheck = await userQueries.friendCheck({sender:socket.sender, receiver:socket.receiver})
      if(friendCheck) {
        console.log("friendcheck test " + friendCheck );
        io.emit(`request-${2}`,[]);
      }
      else{
        let sentRequest = await userQueries.sendRequest({sender:socket.sender, receiver:socket.receiver});
        if(!Array.isArray(sentRequest)) {
          sentRequest = [sentRequest];
        }
        io.emit(`request-${2}`,sentRequest)
      }
      
    })

    socket.on('acceptFriend',async (user)=>{
      console.log(user);
      let acceptedFriend = await userQueries.acceptRequest(user);
      console.log(acceptedFriend);
      let requests = await userQueries.requests({id:1});
      socket.emit(`request-${2}`,requests);
    })

    socket.on('declineFriend',async (user)=>{
      console.log(user);
      let declinedRequest = await userQueries.deleteFriendRequest(user.friend,user.user);
      console.log(declinedRequest);
      let requests = await userQueries.requests({id:1});
      socket.emit(`request-${2}`,requests);
    })

    socket.on('removeFriend', async (user)=>{
      console.log(user);
      let removedFriend = await userQueries.deleteFriends(user);
      console.log(removedFriend);
    })
  });
  
}