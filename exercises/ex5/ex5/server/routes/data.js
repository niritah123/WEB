const express = require("express");
const {
  createItem,
  updateItem,
  getItems,
  deleteItem,
} = require("../controller/dataController");
const router = express.Router();

router.post("/create", createItem);
router.put("/edit/:id", updateItem);
router.get("/items", getItems);
router.delete("/items/:id", deleteItem);

module.exports = router;
