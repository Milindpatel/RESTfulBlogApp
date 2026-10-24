const path = require('node:path');
const express = require('express');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const Blog = require('./models/blog');

function formData(body) {
  const blog = (body && body.blog) || {};
  return Object.fromEntries(Blog.fields.filter((k) => typeof blog[k] === 'string').map((k) => [k, blog[k]]));
}

async function findBlog(req, res, next) {
  const blog = mongoose.isValidObjectId(req.params.id) ? await Blog.findById(req.params.id) : null;
  if (!blog) return next('route');
  res.locals.blog = blog;
  return next();
}

/** Builds the app with the seven RESTful routes for /blogs. */
function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.urlencoded({ extended: true }));
  app.use(methodOverride('_method'));

  app.get('/', (req, res) => res.redirect('/blogs'));

  // INDEX
  app.get('/blogs', async (req, res) => {
    const blogs = await Blog.find({}).sort({ created: -1 });
    res.render('blogs/index', { blogs });
  });

  // NEW
  app.get('/blogs/new', (req, res) => res.render('blogs/new', { blog: {}, error: null }));

  // CREATE
  app.post('/blogs', async (req, res) => {
    const data = formData(req.body);
    try {
      const blog = await Blog.create(data);
      return res.redirect(`/blogs/${blog._id}`);
    } catch (err) {
      if (!(err instanceof mongoose.Error.ValidationError)) throw err;
      return res.status(400).render('blogs/new', { blog: data, error: err.message });
    }
  });

  // SHOW
  app.get('/blogs/:id', findBlog, (req, res) => res.render('blogs/show'));

  // EDIT
  app.get('/blogs/:id/edit', findBlog, (req, res) => res.render('blogs/edit', { error: null }));

  // UPDATE
  app.put('/blogs/:id', findBlog, async (req, res) => {
    const blog = res.locals.blog;
    blog.set(formData(req.body));
    try {
      await blog.save();
      return res.redirect(`/blogs/${blog._id}`);
    } catch (err) {
      if (!(err instanceof mongoose.Error.ValidationError)) throw err;
      return res.status(400).render('blogs/edit', { error: err.message });
    }
  });

  // DESTROY
  app.delete('/blogs/:id', findBlog, async (req, res) => {
    await res.locals.blog.deleteOne();
    res.redirect('/blogs');
  });

  app.use((req, res) => res.status(404).render('error', { message: 'Page not found' }));
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).render('error', { message: 'Something went wrong' });
  });

  return app;
}

module.exports = { createApp };
