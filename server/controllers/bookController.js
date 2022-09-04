const mongo = require("mongodb");
const db = require("../config/database");

const getAllBooks = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).send();
  }
};

//#geet book by id controller
const getBookById = async (req, res) => {
  let bookModel = {};
  const bookId = req.params["bookId"].trim().toString();
  const mongoId = mongo.ObjectId(bookId);
  try {
    const book = await db.books().findOne({ _id: mongoId });
    const author = await db.authors().findOne({ _id: book.author });
    bookModel = { ...book, author: author.name };
    res.json(bookModel);
  } catch (error) {
    res.status(500).send();
  }
};

//#add book controller
const addBook = async (req, res) => {
  let bookModel = {};
  let book = req.body;
  const authorName = book.author;
  try {
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
        .updateOne(
          { title: book.title },
          { $set: bookModel },
          { upsert: true }
        );

      res.json({ isAddes: true });
    } else {
      const authorId = author.lastErrorObject.upserted;
      bookModel = { ...book, author: authorId };

      await db
        .books()
        .updateOne(
          { title: book.title },
          { $set: bookModel },
          { upsert: true }
        );

      res.json({ isAdde: true });
    }
  } catch (error) {
    res.status(500).send();
  }
};

const deleteBook = async (req, res) => {
  const bookId = req.params["bookId"].trim().toString();
  const mongoId = mongo.ObjectId(bookId);
  try {
    const deleteBook = await db.books().deleteOne({ _id: mongoId });

    res.json({ isDeleted: deleteBook.deletedCount > 0 ? true : false });
  } catch (error) {
    res.status(500).send();
  }
};

const updateBook = async (req, res) => {
  let bookData = req.body;
  const bookId = req.params["bookId"].trim().toString();
  const mongoId = mongo.ObjectId(bookId);
  try {
    const existAuthor = await db.authors().findOne({ name: bookData.author });
    if (existAuthor) {
      bookData = { ...bookData, author: existAuthor._id };

      const updateBook = await db
        .books()
        .updateOne({ _id: mongoId }, { $set: bookData });

      res.json({ isUpdated: updateBook.modifiedCount > 0 ? true : false });
    } else {
      const addedAuthor = await db
        .authors()
        .insertOne({ name: bookData.author });

      bookData = { ...bookData, author: addedAuthor.insertedId };

      const updateBook = await db
        .books()
        .updateOne({ _id: mongoId }, { $set: bookData });

      res.json({ isUpdated: updateBook.modifiedCount > 0 ? true : false });
    }
  } catch (error) {
    res.status(500).send();
  }
};

module.exports = { getAllBooks, getBookById, addBook, deleteBook, updateBook };
