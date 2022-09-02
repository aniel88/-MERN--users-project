const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const dotenv = require("dotenv");
const morgan = require("morgan");
dotenv.config({ path: "./config/config.env" });
const book = require("./routes/bookRoutes");
const author = require("./routes/authorRoutes");
const db = require("./config/database");

(async () => {
  await db.connectDB();

  app.listen(process.env.PORT, (error) => {
    if (error) {
      console.log(error);
    }
    console.log(
      `Server is running in ${process.env.NODE_ENV} mode, on port ${process.env.PORT}`
    );
  });

  if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  }

  app.use("/book", book);
  app.use("/author", author);
})();
