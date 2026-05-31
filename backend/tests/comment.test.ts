jest.mock('../config/db', () => ({
  __esModule: true,
  default: { query: jest.fn() }
}));

import request from 'supertest';
import app from '../app';
import db from '../config/db';
import { generateToken } from '../config/jwt';

const mockQuery  = db.query as jest.Mock;
const userToken  = generateToken({ id: 2, email: 'alice@example.com', role: 'USER' });
const adminToken = generateToken({ id: 1, email: 'admin@example.com', role: 'ADMIN' });
const otherToken = generateToken({ id: 3, email: 'bob@example.com',   role: 'USER' });

const mockBlog    = { id: 1, title: 'Blog', is_deleted: 0, user_id: 2, username: 'alice', like_count: 0 };
const mockComment = {
  id: 1, blog_id: 1, user_id: 2, parent_comment_id: null,
  content: 'Hello world', is_edited: 0, is_deleted: 0,
  username: 'alice', created_at: new Date(),
};

beforeEach(() => mockQuery.mockReset());

describe('GET /api/blogs/:blogId/comments', () => {
  it('should return comment tree', async () => {
    mockQuery
      .mockResolvedValueOnce([[mockBlog]])
      .mockResolvedValueOnce([[mockComment]]);
    const res = await request(app).get('/api/blogs/1/comments');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should return 404 if blog not found', async () => {
    mockQuery.mockResolvedValueOnce([[]]);
    const res = await request(app).get('/api/blogs/9999/comments');
    expect(res.status).toBe(404);
  });
});

describe('POST /api/blogs/:blogId/comments', () => {
  it('should create a top-level comment', async () => {
    mockQuery
      .mockResolvedValueOnce([{ insertId: 1 }])
      .mockResolvedValueOnce([[mockComment]]);
    const res = await request(app).post('/api/blogs/1/comments')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ content: 'Hello world' });
    expect(res.status).toBe(201);
    expect(res.body.data.content).toBe('Hello world');
  });

  it('should create a reply with parentCommentId', async () => {
    const reply = { ...mockComment, id: 2, parent_comment_id: 1, content: 'A reply' };
    mockQuery
      .mockResolvedValueOnce([[mockComment]])
      .mockResolvedValueOnce([{ insertId: 2 }])
      .mockResolvedValueOnce([[reply]]);
    const res = await request(app).post('/api/blogs/1/comments')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ content: 'A reply', parentCommentId: 1 });
    expect(res.status).toBe(201);
    expect(res.body.data.parent_comment_id).toBe(1);
  });

  it('should return 401 without token', async () => {
    const res = await request(app).post('/api/blogs/1/comments').send({ content: 'x' });
    expect(res.status).toBe(401);
  });

  it('should return 422 for empty content', async () => {
    const res = await request(app).post('/api/blogs/1/comments')
      .set('Authorization', `Bearer ${userToken}`).send({ content: '' });
    expect(res.status).toBe(422);
  });
});

describe('PUT /api/blogs/:blogId/comments/:commentId', () => {
  it('should edit own comment', async () => {
    const updated = { ...mockComment, content: 'Updated', is_edited: 1 };
    mockQuery
      .mockResolvedValueOnce([[mockComment]])
      .mockResolvedValueOnce([{}])
      .mockResolvedValueOnce([[updated]]);
    const res = await request(app).put('/api/blogs/1/comments/1')
      .set('Authorization', `Bearer ${userToken}`).send({ content: 'Updated' });
    expect(res.status).toBe(200);
    expect(res.body.data.is_edited).toBe(1);
  });

  it('should return 403 if editing another user\'s comment', async () => {
    mockQuery.mockResolvedValueOnce([[mockComment]]);
    const res = await request(app).put('/api/blogs/1/comments/1')
      .set('Authorization', `Bearer ${otherToken}`).send({ content: 'Hack' });
    expect(res.status).toBe(403);
  });
});

describe('DELETE /api/blogs/:blogId/comments/:commentId', () => {
  it('should delete own comment', async () => {
    mockQuery.mockResolvedValueOnce([[mockComment]]).mockResolvedValueOnce([{}]);
    const res = await request(app).delete('/api/blogs/1/comments/1')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(200);
  });

  it('admin can delete any comment', async () => {
    mockQuery.mockResolvedValueOnce([[{ ...mockComment, user_id: 99 }]]).mockResolvedValueOnce([{}]);
    const res = await request(app).delete('/api/blogs/1/comments/1')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
  });
});
