const userQueries = require("../database/userQueries")
const postQueries = require("../database/postQueries");

async function retrieveUserPosts(req, res) {
  const posts = await postQueries.userPosts(req.body.userId);
  return res.json(posts);
}

async function getPost(req,res){
  const postId = parseInt(req.params.postId);
  const post = await postQueries.getPost(postId);
  if(post === null){
    return res.json("Post not found");
  }
  return res.json(post);
}

async function createPost(req,res){
  const post = {
    title:req.body.title,
    content:req.body.content,
    userId:parseInt(req.body.userId),
  }
  const createdPost = await postQueries.createPost(post);
  return res.json(createdPost);
}

async function deletePost(req, res) {
  // const postId = parseInt(req.params.postId);
  // const post = await postQueries.getPost(postId);
  // const postAuthorCheck = await userQueries.userVerify(req.user);
  
  // if (post.authorId !== postAuthorCheck.id)
  //   return res.json("Not authorized to delete this post!");
  // else {
    const postId = parseInt(req.params.postId);
    const deletedPost = await postQueries.deletePost(postId);
    return res.json("Post Deleted!", deletedPost);
  // }
}

module.exports ={
  retrieveUserPosts,
  getPost,
  createPost,
  deletePost,
}