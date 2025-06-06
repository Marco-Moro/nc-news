const endpoints = require("../endpoints.json");

exports.getApi = (request, response) => {
  response.status(200).send({ endpoints });
};