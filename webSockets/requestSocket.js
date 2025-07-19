const userQueries = require("../database/userQueries");
module.exports = function(io){

  io.on('connection', async (socket) => {
    let requests = await userQueries.requests({id:1});
    console.log(requests);
    socket.emit(`request-${2}`,requests);
   
    socket.on('sendRequest',async (socket) =>{
      console.log("test");
      let sentRequest = await userQueries.sendRequest({sender:socket.sender, receiver:socket.receiver});
      console.log(sentRequest);
      io.emit(`request-${2}`,sentRequest)
    })

    socket.on('acceptFriend',async (user)=>{
      console.log(user);
      let acceptedFriend = await userQueries.acceptRequest(user);
      console.log(acceptedFriend);
    })
});
  
}