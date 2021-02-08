const express = require("express");
const mysql = require("mysql");
const path = require("path");
const app = express();
const users = require("./routes/users");
const admin = require("./routes/admin");
const questions = require("./routes/questions");
const category = require("./routes/category");
const result = require("./routes/results");
const config = require("./configs/db");

const port = process.env.PORT || 8080;

const db = mysql.createPool(config);

// connect to database
global.db = db;

// configure middleware
app.set("port", port); // set express to use this port
app.use(express.json()); // parse form data client
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(express.static(path.join(__dirname, "public"))); // configure express to use public folder

// routes for the app
app.use("/user", users);
app.use("/admin", admin);
app.use("/question", questions);
app.use("/category", category);
app.use("/results", result);
app.get("*", function(req, res) {
  //res.sendfile('./public/index.html');
  res
    .status(200)
    .sendFile(path.resolve(path.join(__dirname, "public") + "/index.html"));
});

// set the app to listen on the port
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
