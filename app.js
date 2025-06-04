const express = require("express");
const app = express();
const endpoints = require("./endpoints.json");
const db = require("./db/connection");

app.get("/api", (request, response) => {
   response.status(200).send({ endpoints });
});

app.get("/api/topics", (request, response) => {
    return db.query(`SELECT * FROM topics`).then(({rows}) => {
      response.status(200).send({ topics: rows });
    })
});

module.exports = app