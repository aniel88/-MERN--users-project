const mongo = require("mongodb");
const db = require("../config/database");

const getAllBooks = async (req, res) => {
  let book = [];
  await db
    .getBooksCollection()
    .find({})
    .forEach((doc) => {
      db.getAuthorsCollection().findOne({ _id: doc.author }, (erro, res) => {
        book.push({ ...doc, author: res.name });
        console.log(book);
      });
    });
  res.json(book);
  // .toArray((error, response) => {
  //   if (error) {
  //     console.log(error);
  //     res.statusCode = 500;
  //   }

  //   res.json(response);
  // });
};

//#geet book by id controller
const getBookById = async (req, res) => {
  const bookId = req.params["bookId"].trim().toString();
  const mongoId = mongo.ObjectId(bookId);
  let book = {};

  db.getBooksCollection().findOne({ _id: mongoId }, (error, response) => {
    if (error) {
      console.log(error);
    }
    book = response;
    if (response !== null) {
      db.getAuthorsCollection().findOne(
        { _id: book.author },
        (error, response) => {
          if (error) {
            console.log(error);
          }
          book = { ...book, author: response.name };
          res.json(book);
        }
      );
    } else {
      res.send("Does not exist");
      res.statusCode = 404;
    }
  });
};

//#add book controller
const addBook = async (req, res) => {
  book = req.body;
  const authorName = book.author;

  //#check if author exists in authors collection
  db.getAuthorsCollection().findOneAndUpdate(
    { name: authorName },
    {
      $setOnInsert: {
        name: authorName,
      },
    },
    { upsert: true },
    (error, response) => {
      if (error) {
        console.log(error);
        res.send(error);
      }

      //#check if author is added in authors collection
      const existAuthor = response.lastErrorObject.updatedExisting;

      if (existAuthor) {
        const authorId = response.value._id;
        book = { ...book, author: authorId };

        //#add book (if author exists) with author's id
        db.getBooksCollection()
          .updateOne({ title: book.title }, { $set: book }, { upsert: true })
          .then((response) => {
            res.json({ isAdde: true });
          })
          .catch((err) => {
            console.log(err);
            res.send(err);
          });
      } else {
        const authorId = response.lastErrorObject.upserted;
        book = { ...book, author: authorId };

        //#add book (if author does not exists) with author's id
        db.getBooksCollection()
          .updateOne({ title: book.title }, { $set: book }, { upsert: true })
          .then((response) => {
            res.json({ isAdde: true });
          })
          .catch((err) => {
            console.log(err);
            res.send(err);
          });
      }
    }
  );
};

const deleteBook = async (req, res) => {
  const bookId = req.params["bookId"].trim().toString();
  const mongoId = mongo.ObjectId(bookId);

  db.getBooksCollection()
    .deleteOne({ _id: mongoId })
    .then((response) => {
      res.json({ isDeleted: response.acknowledged });
    })
    .catch((err) => {
      res.send(err);
      console.log(err);
    });
};

const updateBook = async (req, res) => {
  const bookData = req.body;
  const bookId = req.params["bookId"].trim().toString();
  const mongoId = mongo.ObjectId(bookId);

  db.getBooksCollection()
    .updateOne({ _id: mongoId }, { $set: bookData })
    .then((response) => {
      res.json({ isUpdated: response.acknowledged });
    })
    .catch((err) => {
      res.send(err);
    });
};

module.exports = { getAllBooks, getBookById, addBook, deleteBook, updateBook };
