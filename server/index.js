const express = require("express");
const app = express();
const path = __dirname + "/views";

app.use(express.static(path));
const dotenv = require("dotenv");
const morgan = require("morgan");
dotenv.config({ path: "./config/config.env" });

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.get("/", function (req, res) {
  res.send("<html><body><h1>Express</h1></body></html>");
});

app.listen(process.env.PORT, (error) => {
  if (error) {
    console.log(error);
  }
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode, on port ${process.env.PORT}`
  );
});
