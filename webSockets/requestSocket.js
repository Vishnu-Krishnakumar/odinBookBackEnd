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

      next();
    } catch (err) {
      console.error("JWT Error:", err.message);
      return next(new Error("Invalid token"));
    }
  });

  io.on('connection', async (socket) => {
    let user = socket.user;
    console.log(socket.user);
    let list = await userQueries.friendList({id:socket.user.id});
    socket.emit(`friendList-${socket.user.id}`,list);
    
    socket.on(`request-${socket.user.id}`, async (data)=>{
      console.log("Current requests are");
      let requests = await userQueries.requests({id:socket.user.id});
      
      console.log(requests);
      socket.emit(`sentRequest-${user.id}`,requests);
    })

    socket.on('sendRequest',async (data) =>{
      console.log("test");
      const friendCheck = await userQueries.friendCheck({sender:parseInt(data.sender), receiver:parseInt(data.receiver)})
      if(friendCheck) {
        console.log("friendcheck test " + friendCheck );
        io.emit(`request-${data.receiver}`,[]);
      }
      else{
        let sentRequest = await userQueries.sendRequest({sender:parseInt(data.sender), receiver:parseInt(data.receiver)});
        if(!Array.isArray(sentRequest)) {
          sentRequest = [sentRequest];
        }
        io.emit(`request-${data.receiver}`,sentRequest)
      }
      
    })

    socket.on('acceptFriend',async (user)=>{
      console.log(user);
      let acceptedFriend = await userQueries.acceptRequest(user);
      console.log(acceptedFriend);
      let requests = await userQueries.requests({id:socket.user.id});
      socket.emit(`request-${socket.user.id}`,requests);
    })

    socket.on('declineFriend',async (user)=>{
      console.log(user);
      let declinedRequest = await userQueries.deleteFriendRequest(user.friend,user.user);
      console.log(declinedRequest);
      let requests = await userQueries.requests({id:socket.user.id});
      socket.emit(`request-${socket.user.id}`,requests);
    })

    socket.on('removeFriend', async (user)=>{
      console.log(user);
      let removedFriend = await userQueries.deleteFriends(user);
      console.log(removedFriend);
    })
  });
  
}