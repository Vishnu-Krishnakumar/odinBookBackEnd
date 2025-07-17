const userQueries = require("../database/userQueries");
module.exports = function(io){
  io.on('connection', async (socket) => {
    let requests = await userQueries.requests({email:"terryVincent2389@gmail.com"});
    console.log(requests);
    socket.emit(`request-${1}`,"testing");
  });
}