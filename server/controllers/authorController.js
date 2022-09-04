const mongo = require("mongodb");
const db = require("../config/database");

const getAllAuthors = async (req, res) => {
  const authors = await db.authors().find({}).toArray();
  res.json(authors);
};

const getAuthorById = async (req, res) => {
  const authorId = req.params["authorId"].trim().toString();
  const mongoId = mongo.ObjectId(authorId);

  const author = await db.authors().findOne({ _id: mongoId });
  res.json(author);
};

const addAuthor = (req, res) => {
  db.authors().insertOne({ name: req.body.name }, (error, response) => {
    if (error) {
      console.log(error);
    }

    res.json({
      isAdded: response.acknowledged,
      authorId: response.insertedId,
    });
  });
};

module.exports = { getAllAuthors, getAuthorById, addAuthor };
