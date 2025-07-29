const userQueries = require("../database/userQueries")
const postQueries = require("../database/postQueries");
const commentQueries = require("../database/commentQueries");


async function retrieveComments(req, res) {
  const postId = parseInt(req.params.postId);
  const comments = await commentQueries.postComments(postId);
  res.json(comments);
}

async function createComment(req, res) {
  const postId = parseInt(req.params.postId);
  const comment = {
    content: req.body.content,
    username: req.body.email,
    userId: parseInt(req.body.userId),
    postId: postId,
  };
  console.log(comment)
  const createdComment = await commentQueries.createComment(comment);
  res.json(createdComment);
}

async function updateComment(req, res) {
  const commentId = parseInt(req.params.commentId);
  const postId = parseInt(req.params.postId);
  const check = await commentQueries.getComment(commentId);
  if (check.authorId !== req.user.user.id)
    return res.json("Not authorized to edit this post!");
  else {
    const comment = {
      content: req.body.content,
      postId: postId,
      commentId: commentId,
    };
    const updatedComment = await commentQueries.updateComment(comment);
    res.json(updatedComment);
  }
}

async function deleteComment(req, res) {
  const commentId = parseInt(req.params.commentId);
  const postId = parseInt(req.params.postId);
  const check = await commentQueries.getComment(commentId);
  const getPost = await postQueries.getPost(postId);
  const postAuthorCheck = await userQueries.userVerify(req.user.user);
  
  if (check === null) return res.json("Comment not found");
    if (postAuthorCheck.id !== getPost.authorId)
      return res.json("Not authorized to edit this post!");
    else {
      const deletedComment = await commentQueries.deleteComment(commentId);
      return res.json(deletedComment);
    }
}

module.exports = {
  retrieveComments,
  createComment,
  updateComment,
  deleteComment,
}