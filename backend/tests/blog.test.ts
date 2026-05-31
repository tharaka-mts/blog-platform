jest.mock('../config/db', () => ({
  __esModule: true,
  default: { query: jest.fn() }
}));

import request from 'supertest';
import app from '../app';
import db from '../config/db';
import { generateToken } from '../config/jwt';

const mockQuery = db.query as jest.Mock;
const userToken  = generateToken({ id: 2, email: 'alice@example.com', role: 'USER' });
const adminToken = generateToken({ id: 1, email: 'admin@example.com', role: 'ADMIN' });
const otherToken = generateToken({ id: 3, email: 'bob@example.com',   role: 'USER' });

const mockBlog = {
  id: 1, title: 'Test Blog', description: 'Test description for blog post',
  image_url: null, is_deleted: 0, user_id: 2, username: 'alice', like_count: 0,
  created_at: new Date(), updated_at: new Date(),
};

beforeEach(() => mockQuery.mockReset());

describe('GET /api/blogs', () => {
  it('should return paginated blog list', async () => {
    mockQuery
      .mockResolvedValueOnce([[mockBlog]])
      .mockResolvedValueOnce([[{ total: 1 }]]);
    const res = await request(app).get('/api/blogs');
    expect(res.status).toBe(200);
    expect(res.body.meta.total).toBe(1);
  });

  it('should accept keyword and sort params', async () => {
    mockQuery.mockResolvedValueOnce([[]]).mockResolvedValueOnce([[{ total: 0 }]]);
    const res = await request(app).get('/api/blogs?keyword=angular&sort=oldest');
    expect(res.status).toBe(200);
  });
});

describe('GET /api/blogs/:id', () => {
  it('should return a single blog with liked users', async () => {
    mockQuery
      .mockResolvedValueOnce([[mockBlog]])
      .mockResolvedValueOnce([[]]); // getLikedUsers
    const res = await request(app).get('/api/blogs/1');
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(1);
  });

  it('should return 404 for non-existent blog', async () => {
    mockQuery.mockResolvedValueOnce([[]]);
    const res = await request(app).get('/api/blogs/9999');
    expect(res.status).toBe(404);
  });
});

describe('POST /api/blogs', () => {
  it('should create a blog when authenticated', async () => {
    mockQuery
      .mockResolvedValueOnce([{ insertId: 1 }])
      .mockResolvedValueOnce([[mockBlog]]);
    const res = await request(app).post('/api/blogs')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ title: 'Test Blog', description: 'Test description for blog post' });
    expect(res.status).toBe(201);
  });

  it('should return 401 without token', async () => {
    const res = await request(app).post('/api/blogs')
      .send({ title: 'Test Blog', description: 'Test description' });
    expect(res.status).toBe(401);
  });

  it('should return 422 for missing title', async () => {
    const res = await request(app).post('/api/blogs')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ description: 'Test description' });
    expect(res.status).toBe(422);
  });
});

describe('DELETE /api/blogs/:id', () => {
  it('admin can delete any blog', async () => {
    mockQuery.mockResolvedValueOnce([[mockBlog]]).mockResolvedValueOnce([{}]);
    const res = await request(app).delete('/api/blogs/1')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
  });

  it('user cannot delete another user\'s blog', async () => {
    mockQuery.mockResolvedValueOnce([[mockBlog]]);
    const res = await request(app).delete('/api/blogs/1')
      .set('Authorization', `Bearer ${otherToken}`);
    expect(res.status).toBe(403);
  });
});

describe('POST /api/blogs/:id/like', () => {
  it('should like a blog (first time)', async () => {
    mockQuery
      .mockResolvedValueOnce([[mockBlog]])
      .mockResolvedValueOnce([[]])
      .mockResolvedValueOnce([{}])
      .mockResolvedValueOnce([[{ ...mockBlog, like_count: 1 }]]);
    const res = await request(app).post('/api/blogs/1/like')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.liked).toBe(true);
  });

  it('should unlike a blog if already liked', async () => {
    mockQuery
      .mockResolvedValueOnce([[mockBlog]])
      .mockResolvedValueOnce([[{ id: 1 }]])
      .mockResolvedValueOnce([{}])
      .mockResolvedValueOnce([[mockBlog]]);
    const res = await request(app).post('/api/blogs/1/like')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.liked).toBe(false);
  });
});
