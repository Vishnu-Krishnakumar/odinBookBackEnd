const userQueries = require("../database/userQueries");
module.exports = function(io){

  io.on('connection', async (socket) => {
    let requests = await userQueries.requests({email:"terryVincent2389@gmail.com"});
    console.log(requests);
    socket.emit(`request-${2}`,"testing");
    
  socket.on('sendRequest',async (socket) =>{
    console.log("test");
    let sentRequest = await userQueries.sendRequest({sender:socket.sender, receiver:socket.receiver});
    console.log(sentRequest);
  })
  });

}