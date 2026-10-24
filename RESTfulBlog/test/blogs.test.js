import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import mongoose from 'mongoose';
import request from 'supertest';
import { createApp } from '../app';
import Blog from '../models/blog';

let mongo;
try {
  const { MongoMemoryServer } = await import('mongodb-memory-server');
  mongo = await MongoMemoryServer.create();
} catch (err) {
  if (process.env.CI) throw err;
  console.warn(`Skipping database tests: ${err.message}`);
}

describe.skipIf(!mongo)('RESTful blog routes', () => {
  const app = createApp();

  beforeAll(() => mongoose.connect(mongo.getUri()));
  beforeEach(() => Blog.deleteMany({}));
  afterAll(async () => {
    await mongoose.disconnect();
    await mongo?.stop();
  });

  const post = (fields) =>
    request(app).post('/blogs').type('form').send(Object.fromEntries(Object.entries(fields).map(([k, v]) => [`blog[${k}]`, v])));

  it('creates, shows, lists, edits and deletes a post', async () => {
    const created = await post({ title: 'Hello', image: 'https://example.com/a.jpg', body: 'First <script>x</script>' });
    expect(created.status).toBe(302);
    const url = created.headers.location;

    const show = await request(app).get(url);
    expect(show.text).toContain('Hello');
    expect(show.text).toContain('&lt;script&gt;');
    expect((await request(app).get('/blogs')).text).toContain('Hello');

    await request(app).put(url).type('form').send({ 'blog[title]': 'Hello again', 'blog[body]': 'Updated', 'blog[created]': '2000-01-01' });
    const updated = await Blog.findOne();
    expect(updated.title).toBe('Hello again');
    expect(updated.created.getFullYear()).not.toBe(2000);

    await request(app).delete(url);
    expect(await Blog.countDocuments()).toBe(0);
    expect((await request(app).get(url)).status).toBe(404);
  });

  it('re-renders the form with an error for invalid input', async () => {
    const res = await post({ title: '', body: 'x' });
    expect(res.status).toBe(400);
    expect(res.text).toContain('negative message');

    const bad = await post({ title: 'T', body: 'x', image: 'javascript:alert(1)' });
    expect(bad.status).toBe(400);
    expect(await Blog.countDocuments()).toBe(0);
  });
});
