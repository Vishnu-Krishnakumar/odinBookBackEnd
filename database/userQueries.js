const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
require("dotenv").config();

async function createUser(user) {

  const create = await prisma.user.create({
    data: {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      password: user.password,
    },
  });

  return create;
}

async function requests(user){
  console.log(user);
  const requests = await prisma.friendRequest.findMany({
    where:{
      receiverId: user.id,
    },
  })
  console.log(requests);
  return requests;
}

async function sendRequest(user){
  try{
    let requestUpdate = await prisma.friendRequest.create({
      data: {
        senderId: 4,
        receiverId: 1,
      }
    });
    console.log(requestUpdate);
    return requestUpdate;
  }
  catch(error){
    console.log(error)

  }
}

async function acceptRequest(user){
  console.log(user);
  try{
    const acceptFriend = await prisma.friend.create({
      data:{
        userId:user.user,
        friendId:parseInt(user.friend),
      }
    });
    console.log(acceptFriend);
    return acceptFriend;
  }catch(error){console.log(error)}
  deleteFriendRequest(parseInt(user.friend),user.user);
}

async function userFound(user) {
  const found = await prisma.user.findFirst({
    where: {
      email: user.email,
    },
  });
  const match = await bcrypt.compare(user.password, found.password);
  if (match) return found;
  else return null;
}

async function userVerify(user) {
  const found = await prisma.user.findUnique({
    where: {
      email: user.email,
    },
  });
  return found;
}

async function deleteFriendRequest(senderId, receiverId) {
  await prisma.friendRequest.deleteMany({
    where: {
      OR: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId }
      ]
    }
  });
}




module.exports = {
    createUser,
    userFound,
    userVerify,
    requests,
    sendRequest,
    acceptRequest,
  };
  