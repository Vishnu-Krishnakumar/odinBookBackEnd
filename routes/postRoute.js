const { Router } = require("express");
const postRoutes = Router();
const postController = require("../controllers/postController");
const auth = require("../auth/auth");
const validation = require("../validation/validation");

postRoutes.get(
  "/getUserPosts/:userId",
  auth.passport.authenticate("jwt", { session: false }),
  postController.retrieveUserPosts
);

postRoutes.get("/recentPosts",  auth.passport.authenticate("jwt", { session: false }),postController.recentPosts);

postRoutes.get(
  "/:postId",
  auth.passport.authenticate("jwt", { session: false }),
  postController.getPost
);



postRoutes.post(
  "/createPost",
  auth.passport.authenticate("jwt", { session: false }),
  postController.createPost
);
  
postRoutes.post(
  "/likePost",
auth.passport.authenticate("jwt", { session: false }),
postController.likePost 
)
  
postRoutes.delete(
  "/:postId",
  auth.passport.authenticate("jwt", { session: false }),
  postController.deletePost
);

module.exports = postRoutes;