const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
require("dotenv").config();


async function allPosts(){
  const allPosts = await prisma.post.findMany();
  return allPosts;
}
  
async function userPosts(user) {
  const posts = await prisma.post.findMany({
    where: {
      authorId: user.id,
    },
  });
  return posts;
}

async function createPost(post) {
  const created = await prisma.post.create({
  data: {
    title: post.title,
    content: post.content,
    authorId: post.authorId,
  },
  });
  return created;
}

async function getPost(postId) {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });
  return post;
}

async function updatePost(post) {
  console.log(post);
  const updatedPost = await prisma.post.update({
    where: {
      id: post.id,
    },
    data: {
      title: post.title,
      content: post.content,
    },
  });

  console.log(updatedPost);
  return updatedPost;
}

async function deletePost(postId) {
  const deletedPost = await prisma.post.delete({
    where: {
      id: postId,
    },
  });
return deletedPost;
}

module.exports ={
  allPosts,
  userPosts,
  createPost,
  getPost,
  updatePost,
  deletePost
}