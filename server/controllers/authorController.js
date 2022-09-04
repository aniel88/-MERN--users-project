const mongo = require("mongodb");
const db = require("../config/database");

const getAllAuthors = async (req, res) => {
  try {
    const authors = await db.authors().find({}).toArray();
    res.json(authors);
  } catch (error) {
    res.status(500).send();
  }
};

const getAuthorById = async (req, res) => {
  const authorId = req.params["authorId"].trim().toString();
  const mongoId = mongo.ObjectId(authorId);
  try {
    const author = await db.authors().findOne({ _id: mongoId });
  } catch (error) {
    res.json(author);
  }
};

const addAuthor = (req, res) => {
  try {
    db.authors().insertOne({ name: req.body.name }, (error, response) => {
      if (error) {
        console.log(error);
      }

      res.json({
        isAdded: response.acknowledged,
        authorId: response.insertedId,
      });
    });
  } catch (error) {
    res.status(500).send();
  }
};

module.exports = { getAllAuthors, getAuthorById, addAuthor };
