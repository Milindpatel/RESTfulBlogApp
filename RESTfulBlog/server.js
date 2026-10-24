const mongoose = require('mongoose');
const { createApp } = require('./app');

const dbUrl = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/restful_blog_app';
const port = Number(process.env.PORT) || 3000;

mongoose
  .connect(dbUrl)
  .then(() => createApp().listen(port, process.env.IP, () => console.log(`Blog app on http://localhost:${port}`)))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
