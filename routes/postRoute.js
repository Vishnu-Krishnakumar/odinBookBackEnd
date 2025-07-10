const { Router } = require("express");
const postRoutes = Router();
const postController = require("../controllers/postController");
const auth = require("../auth/auth");
const validation = require("../validation/validation");

postRoutes.get(
  "/",
  postController.retrieveUserPosts
);

postRoutes.get(
  "/:postId",
  postController.getPost
);

postRoutes.post(
  "/",
//   auth.passport.authenticate("jwt", { session: false }),
  postController.createPost
);
  

  
postRoutes.delete(
  "/:postId",
//   auth.passport.authenticate("jwt", { session: false }),
  postController.deletePost
);

module.exports = postRoutes;