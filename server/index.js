const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const dotenv = require("dotenv");
const morgan = require("morgan");
dotenv.config({ path: "./config/config.env" });
const book = require("./routes/bookRoutes");

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/book", book);

// const start = async () => {
//   const client = new MongoClient(process.env.mongodb_uri);
//   await client.connect().catch((error) => {
//     console.log(error);
//   });
//   console.log("Connected successfully to the database");
//   database = client.db("mern-project-books");

//   app.listen(process.env.PORT, (error) => {
//     if (error) {
//       console.log(error);
//     }
//     console.log(
//       `Server is running in ${process.env.NODE_ENV} mode, on port ${process.env.PORT}`
//     );
//   });
// };

app.get("/data", async function (req, res) {
  const usersCollection = database.collection("books");
  usersCollection.find({}).toArray((err, res) => {
    if (err) {
      console.log(err);
    }
    console.log(res);
  });
  console.log("Da");
});

app.listen(process.env.PORT, (error) => {
  if (error) {
    console.log(error);
  }
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode, on port ${process.env.PORT}`
  );
});
