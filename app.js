const express = require("express");
const app = express();
app.use(express.json());
const endpoints = require("./endpoints.json");
const db = require("./db/connection");


const { getApi } = require("./controllers/api.controller");
const { getTopics } = require("./controllers/topics.controller");
const { getArticles } = require("./controllers/articles.controller");
const { getUsers } = require("./controllers/users.controller");
const { getArticleById } = require("./controllers/articles.controller");
const { getCommentsByArticleId } = require("./controllers/comments.controller");
const { postCommentByArticleId } = require("./controllers/comments.controller");
const { patchArticleById } = require("./controllers/articles.controller");
const { deleteCommentById } = require("./controllers/comments.controller");


app.get("/api", getApi);
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/users", getUsers);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postCommentByArticleId);
app.patch("/api/articles/:article_id", patchArticleById);
app.delete("/api/comments/:comment_id", deleteCommentById);


app.use((err, request, response, next) => {
  if (err.status) {
    response.status(err.status).send({ msg: err.msg });
  } else next(err);
});

app.use((err, request, response, next) => {
  if (err.code === "22P02") {
    response.status(400).send({ msg: "bad request" });
  } else next(err);
});

app.use((err, request, response, next) => {
  console.log("Unhandled error:", err);
  response.status(500).send({ msg: "Internal Server Error" });
});


module.exports = app