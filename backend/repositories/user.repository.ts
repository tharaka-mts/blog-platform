import pool from '../config/db';
import { UserRow, CreateUserDTO } from '../types';

export const UserRepository = {

  async findByEmail(email: string): Promise<UserRow | null> {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
    return (rows as UserRow[])[0] || null;
  },

  async findById(id: number): Promise<UserRow | null> {
    const [rows] = await pool.query(
      'SELECT id, username, email, role, is_active, is_deleted, created_at FROM users WHERE id = ? LIMIT 1',
      [id]
    );
    return (rows as UserRow[])[0] || null;
  },

  async create(dto: CreateUserDTO): Promise<number> {
    const [result]: any = await pool.query(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [dto.username, dto.email, dto.password, dto.role || 'USER']
    );
    return result.insertId;
  },

  async findAll(): Promise<UserRow[]> {
    const [rows] = await pool.query(
      `SELECT id, username, email, role, is_active, is_deleted, created_at
       FROM users WHERE is_deleted = 0 ORDER BY created_at DESC`
    );
    return rows as UserRow[];
  },

  async setActive(id: number, isActive: boolean): Promise<void> {
    await pool.query('UPDATE users SET is_active = ? WHERE id = ?', [isActive ? 1 : 0, id]);
  },

  async softDelete(id: number): Promise<void> {
    await pool.query('UPDATE users SET is_deleted = 1, is_active = 0 WHERE id = ?', [id]);
  },
};
