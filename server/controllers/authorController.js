const mongo = require("mongodb");
const db = require("../config/database");

const getAllAuthors = (req, res) => {
  db.getAuthorsCollection()
    .find({})
    .toArray((error, response) => {
      if (error) {
        console.log(error);
      }
      res.send(response);
    });
};

const getAuthorById = (req, res) => {
  const authorId = req.params["authorId"].trim().toString();
  const mongoId = mongo.ObjectId(authorId);

  db.getAuthorsCollection().findOne({ _id: mongoId }, (error, response) => {
    if (error) {
      console.log(error);
    }
    res.json(response);
  });
};

const addAuthor = (req, res) => {
  db.getAuthorsCollection().insertOne(
    { name: req.body.name },
    (error, response) => {
      if (error) {
        console.log(error);
      }

      res.json({
        isAdded: response.acknowledged,
        authorId: response.insertedId,
      });
    }
  );
};

module.exports = { getAllAuthors, getAuthorById, addAuthor };
