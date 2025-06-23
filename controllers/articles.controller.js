const { fetchArticles } = require("../models/articles.model");
const { fetchArticleById } = require("../models/articles.model");
const { updateArticleVotes } = require("../models/articles.model");

exports.getArticles = (request, response, next) => {
  const { sort_by, order, topic } = request.query;
  fetchArticles(sort_by, order, topic)
    .then((articles) => {
      response.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticleById = (request, response, next) => {
  const { article_id } = request.params;
  fetchArticleById(article_id)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleById = (request, response, next) => {
  const { article_id } = request.params;
  const { inc_votes } = request.body;

  if (inc_votes === undefined) {
    fetchArticleById(article_id)
      .then((article) => {
        response.status(200).send({ article });
      })
      .catch(next);
  } else {
    updateArticleVotes(article_id, inc_votes)
      .then((updatedArticle) => {
        response.status(200).send({ article: updatedArticle });
      })
      .catch(next);
  }
};
