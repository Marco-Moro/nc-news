const express = require("express");
const app = express();
const endpoints = require("./endpoints.json");
const db = require("./db/connection");


const { getApi } = require("./controllers/api.controller");
const { getTopics } = require("./controllers/topics.controller");
const { getArticles } = require("./controllers/articles.controller");
const { getUsers } = require("./controllers/users.controller");


app.get("/api", getApi);
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/users", getUsers);


app.use((err, request, response, next) => {
  if (err.status) {
    response.status(err.status).send({ msg: err.msg });
  } else next(err);
});

app.use((err, request, response, next) => {
  if (err.code === "22P02") {
    response.status(400).send({ msg: "Invalid input" });
  } else next(err);
});

app.use((err, request, response, next) => {
  console.log("Unhandled error:", err);
  response.status(500).send({ msg: "Internal Server Error" });
});


module.exports = app