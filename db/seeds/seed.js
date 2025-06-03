const db = require("../connection");
const format = require("pg-format");

const {
  topicData,
  userData,
  articleData,
  commentData,
} = require("../data/test-data/index.js");

const seed = () => {
  return db.query("DROP TABLE IF EXISTS comments CASCADE")
    .then(() => db.query("DROP TABLE IF EXISTS articles CASCADE"))
    .then(() => db.query("DROP TABLE IF EXISTS users CASCADE"))
    .then(() => db.query("DROP TABLE IF EXISTS topics CASCADE"))
    .then(() => {
      return db.query(`CREATE TABLE topics (
          slug VARCHAR PRIMARY KEY,
          description VARCHAR,
          img_url VARCHAR(1000)
        )`);
    })
    .then(() => {
      return db.query(`CREATE TABLE users (
          username VARCHAR PRIMARY KEY,
          name VARCHAR,
          avatar_url VARCHAR(1000)
        )`);
    })
    .then(() => {
      return db.query(`CREATE TABLE articles (
          article_id SERIAL PRIMARY KEY,
          title VARCHAR,
          topic VARCHAR REFERENCES topics(slug),
          author VARCHAR REFERENCES users(username),
          body TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          votes INT DEFAULT 0,
          article_img_url VARCHAR(1000)
        )`);
    })
    .then(() => {
      return db.query(`CREATE TABLE comments (
          comment_id SERIAL PRIMARY KEY,
          body TEXT,
          votes INT DEFAULT 0,
          author VARCHAR REFERENCES users(username),
          article_id INT REFERENCES articles(article_id),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);
    })
    .then(() => {
      const topicValues = topicData.map(({ slug, description, img_url }) => [
        slug,
        description,
        img_url,
      ]);
      const insertTopics = format("INSERT INTO topics (slug, description, img_url) VALUES %L RETURNING *",
        topicValues
      );
      return db.query(insertTopics);
    })
    .then(() => {
      const userValues = userData.map(({ username, name, avatar_url }) => [
        username,
        name,
        avatar_url,
      ]);
      const insertUsers = format("INSERT INTO users (username, name, avatar_url) VALUES %L RETURNING *",
        userValues
      );
      return db.query(insertUsers);
    })
    .then(() => {
      const articleValues = articleData.map(
        ({
          title,
          topic,
          author,
          body,
          created_at,
          votes = 0,
          article_img_url,
        }) => [
          title,
          topic,
          author,
          body,
          new Date(created_at),
          votes,
          article_img_url,
        ]
      );
      const insertArticles = format("INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *",
        articleValues
      );
      return db.query(insertArticles);
    })
    .then((result) => {
      const insertedArticles = result.rows;
      const articleTitleToId = {};
      insertedArticles.forEach((article) => {
        articleTitleToId[article.title] = article.article_id;
      });

      const commentValues = commentData
        .map(({ body, created_at, votes = 0, author, article_title }) => {
          const article_id = articleTitleToId[article_title];
          return [body, votes, author, article_id, new Date(created_at)];
        })
       
      const insertComments = format("INSERT INTO comments (body, votes, author, article_id, created_at) VALUES %L RETURNING *",
        commentValues
      );
      return db.query(insertComments);
    });
};

module.exports = seed;
