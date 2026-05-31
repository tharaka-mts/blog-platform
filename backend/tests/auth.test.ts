jest.mock('../config/db', () => ({
  __esModule: true,
  default: { query: jest.fn() }
}));

import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../app';
import db from '../config/db';
import { generateToken } from '../config/jwt';

const mockQuery = db.query as jest.Mock;

const mockUser = {
  id: 1, username: 'alice', email: 'alice@example.com',
  password: '', role: 'USER' as const, is_active: 1, is_deleted: 0, created_at: new Date(), updated_at: new Date(),
};

beforeAll(async () => {
  mockUser.password = await bcrypt.hash('password123', 10);
});

beforeEach(() => mockQuery.mockReset());

// ── POST /api/auth/register ────────────────────────────────────────────────────
describe('POST /api/auth/register', () => {
  it('should register a new user', async () => {
    mockQuery
      .mockResolvedValueOnce([[]])           // findByEmail → not found
      .mockResolvedValueOnce([{ insertId: 1 }])  // create
      .mockResolvedValueOnce([[mockUser]]);   // findById

    const res = await request(app).post('/api/auth/register').send({
      username: 'alice', email: 'alice@example.com', password: 'password123',
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it('should return 409 for duplicate email', async () => {
    mockQuery.mockResolvedValueOnce([[mockUser]]);
    const res = await request(app).post('/api/auth/register')
      .send({ username: 'alice', email: 'alice@example.com', password: 'password123' });
    expect(res.status).toBe(409);
  });

  it('should return 422 for invalid input', async () => {
    const res = await request(app).post('/api/auth/register')
      .send({ username: 'a', email: 'not-email', password: '123' });
    expect(res.status).toBe(422);
  });
});

// ── POST /api/auth/login ───────────────────────────────────────────────────────
describe('POST /api/auth/login', () => {
  it('should login and return JWT', async () => {
    mockQuery.mockResolvedValueOnce([[mockUser]]);
    const res = await request(app).post('/api/auth/login')
      .send({ email: 'alice@example.com', password: 'password123' });
    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeDefined();
  });

  it('should return 401 for wrong password', async () => {
    mockQuery.mockResolvedValueOnce([[mockUser]]);
    const res = await request(app).post('/api/auth/login')
      .send({ email: 'alice@example.com', password: 'wrongpass' });
    expect(res.status).toBe(401);
  });

  it('should return 403 for deactivated user', async () => {
    mockQuery.mockResolvedValueOnce([[{ ...mockUser, is_active: 0 }]]);
    const res = await request(app).post('/api/auth/login')
      .send({ email: 'alice@example.com', password: 'password123' });
    expect(res.status).toBe(403);
  });

  it('should return 401 for non-existent user', async () => {
    mockQuery.mockResolvedValueOnce([[]]);
    const res = await request(app).post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: 'password123' });
    expect(res.status).toBe(401);
  });
});

// ── GET /api/auth/me ──────────────────────────────────────────────────────────
describe('GET /api/auth/me', () => {
  it('should return decoded user from token', async () => {
    const token = generateToken({ id: 1, email: 'alice@example.com', role: 'USER' });
    const res = await request(app).get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe('alice@example.com');
  });
});
