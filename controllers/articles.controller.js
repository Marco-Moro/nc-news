const { fetchArticles } = require("../models/articles.model");

exports.getArticles = (request, response, next) => {
  fetchArticles()
    .then((articles) => {
      response.status(200).send({ articles });
    })
    .catch(next);
};