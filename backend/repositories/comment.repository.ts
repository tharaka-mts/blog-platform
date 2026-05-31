import pool from '../config/db';
import { CommentRow, CreateCommentDTO } from '../types';

export const CommentRepository = {

  async findByBlog(blogId: number): Promise<CommentRow[]> {
    const [rows] = await pool.query(
      `SELECT c.id, c.blog_id, c.user_id, c.parent_comment_id, c.content,
              c.is_edited, c.is_deleted, c.created_at, c.updated_at, u.username
       FROM comments c
       JOIN users u ON u.id = c.user_id
       WHERE c.blog_id = ? AND c.is_deleted = 0
       ORDER BY c.created_at ASC`,
      [blogId]
    );

    // Build nested tree
    const map: Record<number, CommentRow> = {};
    const tree: CommentRow[] = [];
    (rows as CommentRow[]).forEach(r => { map[r.id] = { ...r, replies: [] }; });
    (rows as CommentRow[]).forEach(r => {
      if (r.parent_comment_id && map[r.parent_comment_id]) {
        map[r.parent_comment_id].replies!.push(map[r.id]);
      } else if (!r.parent_comment_id) {
        tree.push(map[r.id]);
      }
    });
    return tree;
  },

  async findById(id: number): Promise<CommentRow | null> {
    const [rows] = await pool.query('SELECT * FROM comments WHERE id = ? LIMIT 1', [id]);
    return (rows as CommentRow[])[0] || null;
  },

  async create(dto: CreateCommentDTO): Promise<number> {
    const [result]: any = await pool.query(
      'INSERT INTO comments (blog_id, user_id, parent_comment_id, content) VALUES (?, ?, ?, ?)',
      [dto.blogId, dto.userId, dto.parentCommentId || null, dto.content]
    );
    return result.insertId;
  },

  async update(id: number, content: string): Promise<void> {
    await pool.query('UPDATE comments SET content = ?, is_edited = 1 WHERE id = ?', [content, id]);
  },

  async softDelete(id: number): Promise<void> {
    await pool.query('UPDATE comments SET is_deleted = 1 WHERE id = ?', [id]);
  },
};
