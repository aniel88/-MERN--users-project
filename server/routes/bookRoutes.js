const express = require("express");
const router = express.Router();

//#import controllers
const {
  getAllBooks,
  getBookById,
  addBook,
  deleteBook,
  updateBook,
} = require("../controllers/bookController");

//#show all data books
router.get("/", getAllBooks);

//#show a book with a specific id
router.get("/:bookId([0-9a-fA-F]{24})", getBookById);

//#add book
router.post("/add", addBook);

//#delete a book by id
router.delete("/:bookId([0-9a-fA-F]{24})", deleteBook);

//#update a book by id
router.put("/:bookId([0-9a-fA-F]{24})", updateBook);

module.exports = router;
