const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();
const authController = require("../controllers/authController");

router.route("/signup").post(authController.signUp);
router.route("/login").post(authController.login);

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.addOneUser);
router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updataUser)
  .delete(userController.deleteUser);
module.exports = router;
