const express = require("express");
const router = express.Router();

const {
  getAllBooks,
  getBookById,
  addBook,
  deleteBook,
  updateBook,
} = require("../controllers/bookController");

router.get("/", getAllBooks);

router.get("/:bookId([0-9a-fA-F]{24})", getBookById);

router.post("/add", addBook);

router.delete("/:bookId([0-9a-fA-F]{24})", deleteBook);

router.put("/:bookId([0-9a-fA-F]{24})", updateBook);

module.exports = router;
