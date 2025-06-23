const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const db = require("../db/connection");

beforeEach(() => {
  return seed(testData);
});
afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with array of topics with correct properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics).toBeInstanceOf(Array);
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        });
      });
  });
});

describe("GET /api/articles", () => {
  test("200: responds with an array of articles with correct properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeInstanceOf(Array);
        expect(articles.length).toBe(13);
        articles.forEach((article) => {
          expect(article).toHaveProperty("author", expect.any(String));
          expect(article).toHaveProperty("title", expect.any(String));
          expect(article).toHaveProperty("article_id", expect.any(Number));
          expect(article).toHaveProperty("topic", expect.any(String));
          expect(article).toHaveProperty("created_at", expect.any(String));
          expect(article).toHaveProperty("votes", expect.any(Number));
          expect(article).toHaveProperty("article_img_url", expect.any(String));
          expect(article).toHaveProperty("comment_count", expect.any(Number));
          expect(article).not.toHaveProperty("body");
        });
      });
  });
  test("200: sorts articles by votes ascending", () => {
    return request(app)
      .get("/api/articles")
      .query({ sort_by: "votes", order: "asc" })
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeInstanceOf(Array);
        for (let i = 0; i < articles.length - 1; i++) {
          expect(articles[i].votes <= articles[i + 1].votes).toBe(true);
        }
      });
  });
  test("200: sorts articles by title descending", () => {
    return request(app)
      .get("/api/articles")
      .query({ sort_by: "title", order: "desc" })
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeInstanceOf(Array);
        for (let i = 0; i < articles.length - 1; i++) {
          expect(articles[i].title >= articles[i + 1].title).toBe(true);
        }
      });
  });
  test("400: responds with bad request for invalid sort_by", () => {
    return request(app)
      .get("/api/articles")
      .query({ sort_by: "not_a_column", order: "asc" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("400: responds with bad request for invalid order", () => {
    return request(app)
      .get("/api/articles")
      .query({ sort_by: "votes", order: "not_an_order" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("200: filters articles by valid topic", () => {
    return request(app)
      .get("/api/articles")
      .query({ topic: "mitch" })
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeInstanceOf(Array);
        articles.forEach((art) => {
          expect(art).toHaveProperty("topic", "mitch");
        });
      });
  });
  test("404: responds with not found when topic does not exist", () => {
    return request(app)
      .get("/api/articles")
      .query({ topic: "not_a_topic" })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
});

describe("GET /api/users", () => {
  test("200: responds with an array of users with correct properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users).toBeInstanceOf(Array);
        expect(users.length).toBeGreaterThan(0);
        users.forEach((user) => {
          expect(user).toHaveProperty("username", expect.any(String));
          expect(user).toHaveProperty("name", expect.any(String));
          expect(user).toHaveProperty("avatar_url", expect.any(String));
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: responds with the correct article object", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toHaveProperty("author", expect.any(String));
        expect(article).toHaveProperty("title", expect.any(String));
        expect(article).toHaveProperty("article_id", 1);
        expect(article).toHaveProperty("body", expect.any(String));
        expect(article).toHaveProperty("topic", expect.any(String));
        expect(article).toHaveProperty("created_at", expect.any(String));
        expect(article).toHaveProperty("votes", expect.any(Number));
        expect(article).toHaveProperty("article_img_url", expect.any(String));
      });
  });
  test("400: responds with an error if article_id is not valid", () => {
    return request(app)
      .get("/api/articles/notanum")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("404: responds with 'not found' if article_id does not exist", () => {
    return request(app)
      .get("/api/articles/99")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
  test("200: includes comment_count in the article object", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toHaveProperty("comment_count", expect.any(Number));
        expect(article.comment_count).toBe(11);
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: responds with an array of comments for the given article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toBeInstanceOf(Array);
        expect(comments.length).toBe(11);
        comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id", expect.any(Number));
          expect(comment).toHaveProperty("votes", expect.any(Number));
          expect(comment).toHaveProperty("created_at", expect.any(String));
          expect(comment).toHaveProperty("author", expect.any(String));
          expect(comment).toHaveProperty("body", expect.any(String));
          expect(comment).toHaveProperty("article_id", 1);
        });
        for (let i = 0; i < comments.length - 1; i++) {
          const currentDate = new Date(comments[i].created_at);
          const nextDate = new Date(comments[i + 1].created_at);
          expect(currentDate >= nextDate).toBe(true);
        }
      });
  });
  test("200: responds with an empty array when the article exists but has no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toEqual([]);
      });
  });
  test("404: responds with not found when article does not exist", () => {
    return request(app)
      .get("/api/articles/99/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
  test("400: responds with bad request for invalid article_id", () => {
    return request(app)
      .get("/api/articles/notanum/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: responds with the newly posted comment", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This article is great!",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toHaveProperty("comment_id", expect.any(Number));
        expect(comment).toHaveProperty("votes", 0);
        expect(comment).toHaveProperty("created_at", expect.any(String));
        expect(comment).toHaveProperty("author", "butter_bridge");
        expect(comment).toHaveProperty("body", "This article is great!");
        expect(comment).toHaveProperty("article_id", 1);
      });
  });
  test("400: responds with error when username is missing", () => {
    const invalidComment = { body: "Missing username" };
    return request(app)
      .post("/api/articles/1/comments")
      .send(invalidComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("400: responds with error when body is missing", () => {
    const invalidComment = { username: "butter_bridge" };
    return request(app)
      .post("/api/articles/1/comments")
      .send(invalidComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("400: responds with error when article_id is invalid", () => {
    return request(app)
      .post("/api/articles/notanum/comments")
      .send({ username: "butter_bridge", body: "Test" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("404: responds with error when article does not exist", () => {
    return request(app)
      .post("/api/articles/99/comments")
      .send({ username: "butter_bridge", body: "Test" })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: responds with the updated article with votes incremented", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toHaveProperty("article_id", 1);
        expect(body.article).toHaveProperty("votes", expect.any(Number));
        expect(body.article.votes).toBe(101);
      });
  });
  test("200: responds with the updated article with votes decremented", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -50 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article.article_id).toBe(1);
        expect(body.article.votes).toBe(50);
      });
  });
  test("200: responds with the original article if no inc_votes is provided", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toHaveProperty("article_id", 1);
        expect(body.article).toHaveProperty("votes", expect.any(Number));
        expect(body.article.votes).toBe(100);
      });
  });
  test("400: responds with 'bad request' when inc_votes is not a number", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "notanumber" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("404: responds with 'not found' when article_id does not exist", () => {
    return request(app)
      .patch("/api/articles/99")
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
  test("400: responds with 'bad request' when article_id is invalid", () => {
    return request(app)
      .patch("/api/articles/notanid")
      .send({ inc_votes: 1 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: responds with no content when comment is deleted", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("404: responds with not found when comment_id does not exist", () => {
    return request(app)
      .delete("/api/comments/99")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
  test("400: responds with bad request when comment_id is invalid", () => {
    return request(app)
      .delete("/api/comments/notanid")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});
