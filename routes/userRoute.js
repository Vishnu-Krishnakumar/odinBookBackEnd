const { Router } = require("express");
const userRoutes = Router();
const userController = require("../controllers/userController");
const auth = require("../auth/auth");
const validation = require("../validation/validation")


userRoutes.post("/register",validation, userController.register);
userRoutes.post("/login", userController.login);

module.exports = userRoutes;
