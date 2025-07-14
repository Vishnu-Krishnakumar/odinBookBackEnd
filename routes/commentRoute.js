const { Router } = require("express");
const commentRoutes = Router();
const commentController = require("../controllers/commentController");
const auth = require("../auth/auth");
const validation = require("../validation/validation");

commentRoutes.get(
  "/:postId",
  commentController.retrieveComments
)

commentRoutes.post(
  "/:postId",
  commentController.createComment
)

commentRoutes.put(
  "/:postId/:commentId",
  //auth.passport.authenticate("jwt", { session: false }),
  commentController.updateComment
);
  
commentRoutes.delete(
  "/:postId/:commentId",
  //auth.passport.authenticate("jwt", { session: false }),
  commentController.deleteComment
);

module.exports = commentRoutes;