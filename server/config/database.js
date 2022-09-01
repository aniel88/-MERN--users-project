const { MongoClient } = require("mongodb");

module.exports = {
  connectToServer: async () => {
    const client = new MongoClient(process.env.mongodb_uri);
    try {
      await client.connect();
      console.log("Connected successfully to the database");
      const db = client.db("mern-project-books");
      return db.collection("books");
    } catch (error) {
      console.log("Conection error to the database");
    }
  },
  getDb: () => {
    return db;
  },
};
