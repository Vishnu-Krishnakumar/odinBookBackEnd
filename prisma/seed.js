const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

const users = [
    {
      firstname: "Alice",
      lastname: "Johnson",
      email: "alice@example.com",
      password: "password123",
      profilepic: "https://i.pravatar.cc/150?img=1"
    },
    {
      firstname: "Bob",
      lastname: "Smith",
      email: "bob@example.com",
      password: "password123",
      profilepic: "https://i.pravatar.cc/150?img=2"
    },
    {
      firstname: "Charlie",
      lastname: "Davis",
      email: "charlie@example.com",
      password: "password123",
      profilepic: "https://i.pravatar.cc/150?img=3"
    },
    {
      firstname: "Diana",
      lastname: "Moore",
      email: "diana@example.com",
      password: "password123",
      profilepic: "https://i.pravatar.cc/150?img=4"
    },
    {
      firstname: "Ethan",
      lastname: "Lee",
      email: "ethan@example.com",
      password: "password123",
      profilepic: "https://i.pravatar.cc/150?img=5"
    },
    {
      firstname: "Fiona",
      lastname: "Brown",
      email: "fiona@example.com",
      password: "password123",
      profilepic: "https://i.pravatar.cc/150?img=6"
    },
    {
      firstname: "George",
      lastname: "Taylor",
      email: "george@example.com",
      password: "password123",
      profilepic: "https://i.pravatar.cc/150?img=7"
    },
    {
      firstname: "Hannah",
      lastname: "Wilson",
      email: "hannah@example.com",
      password: "password123",
      profilepic: "https://i.pravatar.cc/150?img=8"
    },
    {
      firstname: "Ian",
      lastname: "Miller",
      email: "ian@example.com",
      password: "password123",
      profilepic: "https://i.pravatar.cc/150?img=9"
    },
    {
      firstname: "Julia",
      lastname: "Anderson",
      email: "julia@example.com",
      password: "password123",
      profilepic: "https://i.pravatar.cc/150?img=10"
    }
  ];

async function main() {
  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await prisma.user.create({
      data: {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        password: hashedPassword,
        profilepic: user.profilepic,
      }
    });
  }

  console.log("Dummy users seeded!");
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());