const express = require("express");
const personController = require("../controllers/personController");
const router = express.Router();
const authController = require("../controllers/authController");

router
  .route("/")
  .get(
    authController.protect,
    authController.restrictTo("user", "admin"),
    personController.queryPersons
  )
  .post(personController.createPerson);
router
  .route("/:id")
  .get(personController.getPerson)
  .patch(personController.updataPerson)
  .delete(personController.deletePerson);
module.exports = router;
