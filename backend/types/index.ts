import { Request } from 'express';

// ── JWT payload stored in token ────────────────────────────────────────────────
export interface JwtPayload {
  id: number;
  email: string;
  role: 'ADMIN' | 'USER';
  iat?: number;
  exp?: number;
}

// ── Express Request extended with authenticated user ───────────────────────────
export interface AuthRequest extends Request {
  user?: JwtPayload;
}

// ── Database row shapes ────────────────────────────────────────────────────────
export interface UserRow {
  id: number;
  username: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'USER';
  is_active: number;
  is_deleted: number;
  created_at: Date;
  updated_at: Date;
}

export interface BlogRow {
  id: number;
  user_id: number;
  username: string;
  title: string;
  description: string;
  image_url: string | null;
  like_count: number;
  is_deleted: number;
  created_at: Date;
  updated_at: Date;
}

export interface CommentRow {
  id: number;
  blog_id: number;
  user_id: number;
  username: string;
  parent_comment_id: number | null;
  content: string;
  is_edited: number;
  is_deleted: number;
  created_at: Date;
  updated_at: Date;
  replies?: CommentRow[];
}

// ── Service / controller helpers ───────────────────────────────────────────────
export interface CreateUserDTO {
  username: string;
  email: string;
  password: string;
  role?: 'ADMIN' | 'USER';
}

export interface CreateBlogDTO {
  userId: number;
  title: string;
  description: string;
  imageUrl?: string | null;
}

export interface UpdateBlogDTO {
  title: string;
  description: string;
  imageUrl?: string;
}

export interface CreateCommentDTO {
  blogId: number;
  userId: number;
  content: string;
  parentCommentId?: number | null;
}
