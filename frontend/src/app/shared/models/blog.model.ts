export interface Blog {
  id: number;
  title: string;
  description: string;
  image_url: string | null;
  user_id: number;
  username: string;
  like_count: number;
  liked?: boolean;
  likedUsers?: { id: number; username: string }[];
  created_at: string;
  updated_at: string;
}

export interface PaginatedBlogs {
  data: Blog[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
  };
}
