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
userRoutes.post("/profilePictureUpload",upload.single('avatar'),userController.profileUpload);
userRoutes.post("/profilePictureUpdate",upload.single('avatar'),userController.profilePictureUpdate);
module.exports = userRoutes;
