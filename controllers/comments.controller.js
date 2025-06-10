const { fetchCommentsByArticleId } = require("../models/comments.model");
const { insertCommentByArticleId } = require("../models/comments.model");
const { removeCommentById } = require("../models/comments.model");

exports.getCommentsByArticleId = (request, response, next) => {
  const { article_id } = request.params;
  fetchCommentsByArticleId(article_id)
  .then((comments) => {
    response.status(200).send({ comments });
  })
  .catch(next);
};

exports.postCommentByArticleId = (request, response, next) => {
  const { article_id } = request.params;
  const { username, body } = request.body;
  insertCommentByArticleId(article_id, username, body)
  .then((newComment) => {
    response.status(201).send({ comment: newComment });
  })
  .catch(next);
};

exports.deleteCommentById = (request, response, next) => {
  const { comment_id } = request.params;
  removeCommentById(comment_id)
    .then(() => {
      response.status(204).send();
    })
    .catch(next);
};