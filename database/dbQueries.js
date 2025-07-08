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

module.exports = {
    createUser,
    userFound,

  };
  