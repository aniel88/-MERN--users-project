const express = require("express");
const router = express.Router();
const {
  getAllAuthors,
  getAuthorById,
  addAuthor,
} = require("../controllers/authorController");

router.get("/", getAllAuthors);

router.post("/add", addAuthor);

router.get("/:authorId([0-9a-fA-F]{24})", getAuthorById);

module.exports = router;
