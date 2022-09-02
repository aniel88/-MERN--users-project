const { MongoClient } = require("mongodb");

let client;
let db;

const connectDB = () => {
  client = new MongoClient(process.env.mongodb_uri);
  return new Promise((resolve, reject) => {
    client.connect((err) => {
      if (err) {
        return reject(err);
      }
      db = client.db(process.env.databaseName);
      console.log("Connected to the database");
      return resolve(db);
    });
  });
};

const getCurrentDb = () => {
  return db;
};

const getBooksCollection = () => {
  return db.collection("books");
};

const getAuthorsCollection = () => {
  return db.collection("authors");
};

module.exports.connectDB = connectDB;
module.exports.getCurrentDb = getCurrentDb;
module.exports.getBooksCollection = getBooksCollection;
module.exports.getAuthorsCollection = getAuthorsCollection;
