import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';

const app = createApp();

describe('pages without a database', () => {
  it('redirects / to /blogs', async () => {
    const res = await request(app).get('/');
    expect(res.headers.location).toBe('/blogs');
  });

  it('renders the new post form', async () => {
    const res = await request(app).get('/blogs/new');
    expect(res.status).toBe(200);
    expect(res.text).toContain('name="blog[title]"');
  });

  it('returns 404 for malformed ids', async () => {
    expect((await request(app).get('/blogs/not-an-id')).status).toBe(404);
  });
});
