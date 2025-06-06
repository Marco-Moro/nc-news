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

