const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
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
const { handleCustomErrors, handlePSQLErrors, handle500 } = require("./errors");

app.get("/api", getApi);
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/users", getUsers);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postCommentByArticleId);
app.patch("/api/articles/:article_id", patchArticleById);
app.delete("/api/comments/:comment_id", deleteCommentById);
app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.use(handle500);

module.exports = app;
