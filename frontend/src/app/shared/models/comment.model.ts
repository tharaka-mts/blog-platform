export interface Comment {
  id: number;
  blog_id: number;
  user_id: number;
  username: string;
  parent_comment_id: number | null;
  content: string;
  is_edited: number;
  is_deleted: number;
  created_at: string;
  updated_at: string;
  replies?: Comment[];
}
