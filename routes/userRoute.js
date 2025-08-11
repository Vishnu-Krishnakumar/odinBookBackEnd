const { Router } = require("express");
const userRoutes = Router();
const userController = require("../controllers/userController");
const auth = require("../auth/auth");
const validation = require("../validation/validation")
const multer  = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })


userRoutes.post("/register",validation, userController.register);
userRoutes.post("/login", userController.login);
userRoutes.post("/profileUpdate",auth.passport.authenticate("jwt", { session: false }),userController.updateUser)
userRoutes.post("/profilePictureUpload",auth.passport.authenticate("jwt", { session: false }),upload.single('avatar'),userController.profileUpload);
userRoutes.post("/profilePictureUpdate",upload.single('avatar'),userController.profilePictureUpdate);
userRoutes.get("/profile/:userId",userController.getUser);
userRoutes.get("/profile/friendList/:userId",userController.friendList);
userRoutes.get("/userList",auth.passport.authenticate("jwt", { session: false }), userController.userList);
userRoutes.get("/userListIntro",auth.passport.authenticate("jwt", { session: false }), userController.userListIntro);
userRoutes.get("/friendRequests",auth.passport.authenticate("jwt", { session: false }),userController.friendRequest);
module.exports = userRoutes;
