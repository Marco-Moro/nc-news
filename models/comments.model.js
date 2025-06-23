const db = require("../db/connection");

exports.fetchCommentsByArticleId = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
      return db.query(
        `SELECT comment_id, votes, created_at, author, body, article_id
         FROM comments
         WHERE article_id = $1
         ORDER BY created_at DESC`,
        [article_id]
      );
    })
    .then(({ rows }) => {
      return rows;
    });
};

exports.insertCommentByArticleId = (article_id, username, body) => {
  if (!username || !body) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
      return db.query(`SELECT * FROM users WHERE username = $1`, [username]);
    })
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "User not found" });
      }
      return db.query(
        `INSERT INTO comments (article_id, author, body)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [article_id, username, body]
      );
    })
    .then(({ rows }) => rows[0]);
};

exports.removeCommentById = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [
      comment_id,
    ])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
    });
};
