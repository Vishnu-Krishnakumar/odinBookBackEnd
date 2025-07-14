const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
require("dotenv").config();

async function getComment(commentId) {
  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
  });

  return comment;
}

async function postComments(postId) {
  const comments = await prisma.comment.findMany({
    where: {
      postId: postId,
    },
  });

  return comments;
}

async function createComment(comment) {
  const createdComment = await prisma.comment.create({
    data: {
      username: comment.username,
      content: comment.content,
      postId: comment.postId,
      userId: comment.userId,
    },
  });

  return createdComment;
}

async function updateComment(comment) {
  const updatedComment = await prisma.comment.update({
    where: {
      id: comment.commentId,
      postId: comment.postId,
    },
    data: {
      content: comment.content,
    },
  });

  return updatedComment;
}

async function deleteComment(commentId) {
  const deletedComment = await prisma.comment.delete({
    where: {
      id: commentId,
    },
  });

  return deletedComment;
}


module.exports ={
  getComment,
  postComments,
  createComment,
  updateComment,
  deleteComment,
}