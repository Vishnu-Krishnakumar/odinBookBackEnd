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

async function friendCheck(user){
  const friendCheck = await prisma.friend.findFirst({
    where:{
      OR:[
        { friendId: user.sender, userId:user.receiver },
        { friendId: user.receiver, userId: user.sender }
      ]
    }
  })
  console.log("testing for friend");
  console.log(friendCheck);
  if(friendCheck === null) return false;
  else return true;
}

async function sendRequest(user){
  try{
    let requestUpdate = await prisma.friendRequest.create({
      data: {
        senderId: user.sender,
        receiverId: user.receiver,
      }
    });
    console.log(requestUpdate);
    return requestUpdate;
  }
  catch(error){
    console.log(error)
    return [];
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
    await deleteFriendRequest(parseInt(user.friend),user.user);
    console.log(acceptFriend);
    return acceptFriend;
  }catch(error){console.log(error)}
}

async function userFound(user) {
  const found = await prisma.user.findUnique({
    where: {
      email: user.email,
    },
  });
  if(found === null) return found;
  const match = await bcrypt.compare(user.password, found.password);
  if (match) return found;
  else return null;
}
async function retrieveUser(userId){
  const found = await prisma.user.findUnique({
    where:{
      id:userId,
    }
  })
  return found;
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
  try {
    let deleted = await prisma.friendRequest.deleteMany({
      where: {
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId }
        ]
      }
    })
    console.log(deleted);
  } catch (error) {
    console.error('Error deleting friend request:', error);
    throw error;
  }
}

async function deleteFriends(user){
  try{
    let deleted = await prisma.friend.deleteMany({
      where:{
        or:[
          {userId:user.receiver,friendId:user.sender},
          {userId:user.sender,friendId:user.receiver}
        ]
      }
    })

  }catch(error){
    console.log(error);
  }
}

async function friendList(user){
  let friends = await prisma.friend.findMany({
    where:{
      userId:user.id
    }
  })
  let friendsList = [];
  for(const friend of friends){
    console.log(friend);
    let user = await prisma.user.findFirst({
      where:{
        id:friend.friendId
      },
      select:{
        id:true,
        firstname:true,
        lastname:true,
        email:true,
        profilepic:true,
      }
    })
    console.log(user);
    friendsList.push(user);
  }

  console.log(friendsList);
  return friendsList;
}
module.exports = {
    createUser,
    userFound,
    userVerify,
    requests,
    sendRequest,
    acceptRequest,
    deleteFriendRequest,
    friendCheck,
    deleteFriends,
    friendList,
    retrieveUser,
  };
  