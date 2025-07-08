# NC News - Backend API

## Hosted Version

The backend API is hosted live at:  
[https://nc-news-backend-marco.onrender.com/api](https://nc-news-backend-marco.onrender.com/api)  
_(Replace this with your actual Render link if different)_

---

## Project Overview

This is the **backend** for the NC News project, a RESTful API built using **Node.js**, **Express.js**, and **PostgreSQL** (with **pg** and **dotenv**).

The purpose of this API is to serve content to a frontend news app, allowing users to:

- View articles and their details
- Filter articles by topic
- Sort articles by date, votes, or comment count
- View comments for a specific article
- Post new comments to articles
- Update article vote counts (PATCH)
- Delete comments by ID

---

# Instruction to setup environment variables

Before running the project, in the root folder, you need to create two files:

1. `.env.development`
2. `.env.test`

In .env.development add: PGDATABASE=nc_news

In .env.test add: PGDATABASE=nc_news_test

These files are used to connect the project to the correct database.

## Functionality & Endpoints

All routes follow RESTful principles and return consistent JSON responses. Here are the core endpoints:

### `GET /api`

Returns a JSON object describing all available endpoints.

### `GET /api/topics`

Returns a list of all topics.

### `GET /api/articles`

Returns a list of articles. Supports queries for:

- `topic`
- `sort_by`
- `order` (asc/desc)

### `GET /api/articles/:article_id`

Returns a single article, including comment count.

### `PATCH /api/articles/:article_id`

Increments or decrements the votes of a specific article.

### `GET /api/articles/:article_id/comments`

Returns all comments for a given article.

### `POST /api/articles/:article_id/comments`

Adds a new comment to the specified article.

### `DELETE /api/comments/:comment_id`

Deletes a comment by its ID.

### `GET /api/users`

Returns a list of users.

### `GET /api/users/:username`

Returns a single user by username.

---

## Frontend Repository

[https://github.com/Marco-Moro/nc-news-fe](https://github.com/Marco-Moro/nc-news-fe)

---

## Minimum Requirements

- Node.js: **v18.17.1**
- PostgreSQL: locally running instance

---

## Running Locally

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd nc-news-be
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up your `.env` files

Create two files:

#### `.env.development`

```
PGDATABASE=nc_news
```

#### `.env.test`

```
PGDATABASE=nc_news_test
```

### 4. Create and seed the database

```bash
npm run setup-dbs
npm run seed
```

### 5. Run the server

```bash
npm start
```

Server will run by default on `http://localhost:9090`

---

## Running Tests

```bash
npm test
```

Uses Jest and Supertest for testing all endpoints, including error handling and edge cases.

---

## Credits

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
