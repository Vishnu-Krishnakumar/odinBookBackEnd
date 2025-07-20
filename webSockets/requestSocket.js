const userQueries = require("../database/userQueries");
module.exports = function(io){

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