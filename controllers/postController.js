const userQueries = require("../database/userQueries")
const postQueries = require("../database/postQueries");

async function retrieveUserPosts(req, res) {
  console.log("retrieving user " + req.params.userId + " posts");
  const posts = await postQueries.userPosts(req.params.userId);
  console.log(posts);
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
async function likePost(req,res){
  let likedPost = await postQueries.likePost({id:parseInt(req.body.id), postId:parseInt(req.body.postId)})
  console.log(likedPost);
  if(likedPost === true) return res.json("Already Liked this post!");
  else return res.json(likedPost);
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
  likePost,
}