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
  const requests = await prisma.user.findMany({
    where:{
      email: user.email,
    },
    select:{
      requests: true,
    }
  })
  return requests;
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

module.exports = {
    createUser,
    userFound,
    userVerify,
    requests,
  };
  