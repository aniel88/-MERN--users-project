const mongo = require("mongodb");
const db = require("../config/database");

const getAllBooks = async (req, res) => {
  let books = await db
    .books()
    .aggregate([
      {
        $lookup: {
          from: "authors",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
    ])
    .toArray();

  res.json(books);
};

//#geet book by id controller
const getBookById = async (req, res) => {
  let bookModel = {};
  const bookId = req.params["bookId"].trim().toString();
  const mongoId = mongo.ObjectId(bookId);
  const book = await db.books().findOne({ _id: mongoId });
  const author = await db.authors().findOne({ _id: book.author });
  bookModel = { ...book, author: author.name };
  res.json(bookModel);
};

//#add book controller
const addBook = async (req, res) => {
  let bookModel = {};
  let book = req.body;
  const authorName = book.author;

  //#check if author exists in authors collection
  const author = await db.authors().findOneAndUpdate(
    { name: authorName },
    {
      $setOnInsert: {
        name: authorName,
      },
    },
    { upsert: true }
  );
  const existAuthor = author.lastErrorObject.updatedExisting;

  if (existAuthor) {
    const authorId = author.value._id;
    let bookModel = { ...book, author: authorId };

    await db
      .books()
      .updateOne({ title: book.title }, { $set: bookModel }, { upsert: true });

    res.json({ isAdde: true });
  } else {
    const authorId = author.lastErrorObject.upserted;
    bookModel = { ...book, author: authorId };

    await db
      .books()
      .updateOne({ title: book.title }, { $set: bookModel }, { upsert: true });

    res.json({ isAdde: true });
  }
};

const deleteBook = async (req, res) => {
  const bookId = req.params["bookId"].trim().toString();
  const mongoId = mongo.ObjectId(bookId);
  const deleteBook = await db.books().deleteOne({ _id: mongoId });

  res.json({ isDeleted: deleteBook.deletedCount > 0 ? true : false });
};

const updateBook = async (req, res) => {
  const bookData = req.body;
  const bookId = req.params["bookId"].trim().toString();
  const mongoId = mongo.ObjectId(bookId);
  const updateBook = await db
    .books()
    .updateOne({ _id: mongoId }, { $set: bookData });

  res.json({ isUpdated: updateBook.modifiedCount > 0 ? true : false });
};

module.exports = { getAllBooks, getBookById, addBook, deleteBook, updateBook };
