const express = require("express");
const personController = require("../controllers/personController");
const router = express.Router();

router
  .route("/")
  .get(personController.queryPersons)
  .post(personController.createPerson);
router
  .route("/:id")
  .get(personController.getPerson)
  .patch(personController.updataPerson)
  .delete(personController.deletePerson);
module.exports = router;
