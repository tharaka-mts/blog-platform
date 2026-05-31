import pool from '../config/db';
import { BlogRow, CreateBlogDTO, UpdateBlogDTO } from '../types';

export const BlogRepository = {

  async findAll(opts: {
    page: number; pageSize: number; keyword: string; sort: string;
  }): Promise<{ rows: BlogRow[]; total: number }> {
    const { page, pageSize, keyword, sort } = opts;
    const offset = (page - 1) * pageSize;
    const order  = sort === 'oldest' ? 'ASC' : 'DESC';
    const like   = `%${keyword}%`;

    const [rows] = await pool.query(
      `SELECT b.id, b.title, b.description, b.image_url, b.created_at, b.updated_at,
              u.id AS user_id, u.username, COUNT(DISTINCT bl.id) AS like_count
       FROM blogs b
       JOIN users u ON u.id = b.user_id
       LEFT JOIN blog_likes bl ON bl.blog_id = b.id
       WHERE b.is_deleted = 0 AND (b.title LIKE ? OR b.description LIKE ?)
       GROUP BY b.id
       ORDER BY b.created_at ${order}
       LIMIT ? OFFSET ?`,
      [like, like, pageSize, offset]
    );

    const [[count]]: any = await pool.query(
      'SELECT COUNT(*) AS total FROM blogs WHERE is_deleted = 0 AND (title LIKE ? OR description LIKE ?)',
      [like, like]
    );

    return { rows: rows as BlogRow[], total: count.total };
  },

  async findById(id: number): Promise<BlogRow | null> {
    const [rows] = await pool.query(
      `SELECT b.id, b.title, b.description, b.image_url, b.is_deleted,
              b.created_at, b.updated_at, u.id AS user_id, u.username,
              COUNT(DISTINCT bl.id) AS like_count
       FROM blogs b
       JOIN users u ON u.id = b.user_id
       LEFT JOIN blog_likes bl ON bl.blog_id = b.id
       WHERE b.id = ? GROUP BY b.id`,
      [id]
    );
    return (rows as BlogRow[])[0] || null;
  },

  async create(dto: CreateBlogDTO): Promise<number> {
    const [result]: any = await pool.query(
      'INSERT INTO blogs (user_id, title, description, image_url) VALUES (?, ?, ?, ?)',
      [dto.userId, dto.title, dto.description, dto.imageUrl || null]
    );
    return result.insertId;
  },

  async update(id: number, dto: UpdateBlogDTO): Promise<void> {
    const fields = ['title = ?', 'description = ?'];
    const params: any[] = [dto.title, dto.description];
    if (dto.imageUrl !== undefined) { fields.push('image_url = ?'); params.push(dto.imageUrl); }
    params.push(id);
    await pool.query(`UPDATE blogs SET ${fields.join(', ')} WHERE id = ?`, params);
  },

  async softDelete(id: number): Promise<void> {
    await pool.query('UPDATE blogs SET is_deleted = 1 WHERE id = ?', [id]);
  },

  // ── Likes ──────────────────────────────────────────────────────────────────
  async findLike(userId: number, blogId: number): Promise<{ id: number } | null> {
    const [rows] = await pool.query(
      'SELECT id FROM blog_likes WHERE user_id = ? AND blog_id = ?', [userId, blogId]
    );
    return (rows as any[])[0] || null;
  },

  async addLike(userId: number, blogId: number): Promise<void> {
    await pool.query('INSERT INTO blog_likes (user_id, blog_id) VALUES (?, ?)', [userId, blogId]);
  },

  async removeLike(userId: number, blogId: number): Promise<void> {
    await pool.query('DELETE FROM blog_likes WHERE user_id = ? AND blog_id = ?', [userId, blogId]);
  },

  async getLikedUsers(blogId: number): Promise<{ id: number; username: string }[]> {
    const [rows] = await pool.query(
      `SELECT u.id, u.username FROM blog_likes bl
       JOIN users u ON u.id = bl.user_id
       WHERE bl.blog_id = ? ORDER BY bl.created_at DESC`,
      [blogId]
    );
    return rows as { id: number; username: string }[];
  },

  async findByUser(userId: number): Promise<BlogRow[]> {
    const [rows] = await pool.query(
      `SELECT b.id, b.title, b.description, b.image_url, b.created_at, b.updated_at,
              COUNT(DISTINCT bl.id) AS like_count
       FROM blogs b
       LEFT JOIN blog_likes bl ON bl.blog_id = b.id
       WHERE b.user_id = ? AND b.is_deleted = 0
       GROUP BY b.id ORDER BY b.created_at DESC`,
      [userId]
    );
    return rows as BlogRow[];
  },

  async findDeleted(): Promise<BlogRow[]> {
    const query = `
      SELECT b.*, u.username, COUNT(DISTINCT bl.id) AS like_count 
      FROM blogs b 
      JOIN users u ON b.user_id = u.id 
      LEFT JOIN blog_likes bl ON bl.blog_id = b.id
      WHERE b.is_deleted = 1 
      GROUP BY b.id
      ORDER BY b.updated_at DESC
    `;
    const [rows] = await pool.query(query);
    return rows as BlogRow[];
  },

  async restore(id: number): Promise<void> {
    await pool.query('UPDATE blogs SET is_deleted = 0 WHERE id = ?', [id]);
  },

  async hardDelete(id: number): Promise<void> {
    await pool.query('DELETE FROM blogs WHERE id = ?', [id]);
  }
};
