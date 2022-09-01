const mongo = require("mongodb");
const mongoUtil = require("../config/database");
const collection = mongoUtil.connectToServer();

const getAllBooks = async (req, res) => {
  await collection.then((response) =>
    response.find({}).toArray((error, response) => {
      if (error) {
        console.log(err);
      }
      res.json(response);
    })
  );
};

const getBookById = async (req, res) => {
  const bookId = req.params["bookId"].trim().toString();
  const mongoId = mongo.ObjectId(bookId);

  await collection.then((response) => {
    response
      .find({ _id: mongo.ObjectId(bookId) })
      .toArray((error, response) => {
        if (error) {
          console.log(error);
        }
        console.log(response);
        res.json(response);
      });
  });
  console.log(bookId);
};

const addBook = async (req, res) => {
  await collection.then((response) => {
    response
      .updateOne(
        { title: req.body.title },
        { $set: req.body },
        { upsert: true }
      )
      .then((response) => {
        if (response.upsertedId) {
          res.json({ isAdded: true });
        } else {
          res.json({ isAdded: false });
        }
      })
      .catch((err) => {
        res.send(err);
        console.log(err);
      });
  });
};

const deleteBook = async (req, res) => {
  const bookId = req.params["bookId"].trim().toString();
  const mongoId = mongo.ObjectId(bookId);

  await collection.then((response) => {
    response
      .deleteOne({ _id: mongoId })
      .then((response) => {
        res.json({ isDeleted: response.acknowledged });
      })
      .catch((err) => {
        res.send(err);
        console.log(err);
      });
  });
};

const updateBook = async (req, res) => {
  const bookData = req.body;
  const bookId = req.params["bookId"].trim().toString();
  const mongoId = mongo.ObjectId(bookId);

  await collection.then((response) => {
    response
      .updateOne({ _id: mongoId }, { $set: bookData })
      .then((response) => {
        res.json({ isUpdated: response.acknowledged });
      })
      .catch((err) => {
        res.send(err);
      });
  });
};

module.exports = { getAllBooks, getBookById, addBook, deleteBook, updateBook };
