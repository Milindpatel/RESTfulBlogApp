# RESTful Blog App

A small blog built with Express, EJS and MongoDB to practise the seven RESTful routes (from the Udemy "Web Developer Bootcamp").

![CI](https://github.com/Milindpatel/RESTfulBlogApp/actions/workflows/ci.yml/badge.svg)

## Routes

| Name | Path | Verb | Purpose |
| --- | --- | --- | --- |
| Index | `/blogs` | GET | List posts, newest first |
| New | `/blogs/new` | GET | Form for a new post |
| Create | `/blogs` | POST | Save a post |
| Show | `/blogs/:id` | GET | One post |
| Edit | `/blogs/:id/edit` | GET | Edit form |
| Update | `/blogs/:id` | PUT | Save changes |
| Destroy | `/blogs/:id` | DELETE | Delete a post |

Forms use `?_method=PUT/DELETE` via method-override. Post bodies are shown as plain text (HTML is escaped) with line breaks kept.

## Running

Requires Node.js 20+ and MongoDB.

```bash
cd RESTfulBlog
npm install
npm start          # http://localhost:3000
npm test
```

Set `DATABASE_URL` to use a database other than `mongodb://127.0.0.1:27017/restful_blog_app`.

## Tech stack

Express 5, EJS 3, Mongoose 9, Fomantic UI 2.9, Vitest + Supertest + mongodb-memory-server.
