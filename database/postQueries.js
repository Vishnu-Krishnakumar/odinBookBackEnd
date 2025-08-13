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
      authorId: parseInt(user),
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
  return posts;
}

async function createPost(post) {
  const created = await prisma.post.create({
  data: {
    title: post.title,
    content: post.content,
    authorId: post.userId,
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

async function getRecentPosts(userId, limit = 10, skip = 0){
  // const posts = await prisma.post.findMany({
  //   where: {

  //     OR: [
  //       { authorId: userId },
  //       { authorId: { not: userId } }
  //     ]
  //   },

  //   orderBy: { createdAt: "desc" }, 
  //   take: limit,
  //   skip,
  //   include: {
  //     author: {
  //       select: { id: true, firstname: true, lastname: true, profilepic: true }
  //     },
  //     comments: true
  //   }
  // });
  const posts = await prisma.$queryRaw`
  SELECT 
    p.*,
    u.firstname,
    u.lastname,
    u.profilepic
  FROM "Post" p
  JOIN (
    SELECT "authorId", MAX("createdAt") as latest
    FROM "Post"
    WHERE "authorId" = ${userId}
       OR "authorId" IN (
         SELECT "friendId" FROM "Friend" WHERE "userId" = ${userId}
         UNION
         SELECT "userId" FROM "Friend" WHERE "friendId" = ${userId}
       )
    GROUP BY "authorId"
  ) latest_posts
    ON p."authorId" = latest_posts."authorId"
     AND p."createdAt" = latest_posts.latest
    JOIN "User" u
    ON p."authorId" = u.id
    ORDER BY p."createdAt" DESC;
  `;
  return posts;
}

async function updatePost(post) {

  const updatedPost = await prisma.post.update({
    where: {
      id: post.id,
    },
    data: {
      title: post.title,
      content: post.content,
    },
  });


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

async function likePost(user) { 
  if(await likeListCheck(user)) return true;
  const likedPost = await prisma.post.update({
    where:{
      id:user.postId,
    },
    data:{
      likes:{
        push:user.id,
      }
    },
    select:{
      likes:true,
    }
  })
  return likedPost;
}

async function likeListCheck(user){

  let listChecked = false;
  let likeList = await prisma.post.findMany({
    where:{
      id:user.postId, 
    }
  })

  likeList = likeList[0].likes;
  
  for(const like of likeList){
    if (like === user.id){
      listChecked = true;
    }
  }
  return listChecked;
}

module.exports ={
  allPosts,
  userPosts,
  createPost,
  getPost,
  updatePost,
  deletePost,
  likePost,
  getRecentPosts
}