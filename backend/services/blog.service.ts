import { BlogRepository } from '../repositories/blog.repository';
import { CreateBlogDTO, UpdateBlogDTO } from '../types';

export const BlogService = {

  async getBlogs(opts: { page: number; pageSize: number; keyword: string; sort: string }) {
    return BlogRepository.findAll(opts);
  },

  async getBlogById(id: number, userId?: number) {
    const blog = await BlogRepository.findById(id);
    if (!blog || blog.is_deleted) {
      const err: any = new Error('Blog not found.'); err.status = 404; throw err;
    }
    const likedUsers = await BlogRepository.getLikedUsers(id);
    const liked      = userId ? likedUsers.some(u => u.id === userId) : false;
    return { ...blog, liked, likedUsers };
  },

  async createBlog(dto: CreateBlogDTO) {
    const id   = await BlogRepository.create(dto);
    return BlogRepository.findById(id);
  },

  async updateBlog(id: number, userId: number, role: string, dto: UpdateBlogDTO) {
    const blog = await BlogRepository.findById(id);
    if (!blog || blog.is_deleted) {
      const err: any = new Error('Blog not found.'); err.status = 404; throw err;
    }
    if (blog.user_id !== userId && role !== 'ADMIN') {
      const err: any = new Error('You can only edit your own posts.'); err.status = 403; throw err;
    }
    await BlogRepository.update(id, dto);
    return BlogRepository.findById(id);
  },

  async deleteBlog(id: number, userId: number, role: string) {
    const blog = await BlogRepository.findById(id);
    if (!blog || blog.is_deleted) {
      const err: any = new Error('Blog not found.'); err.status = 404; throw err;
    }
    if (blog.user_id !== userId && role !== 'ADMIN') {
      const err: any = new Error('You can only delete your own posts.'); err.status = 403; throw err;
    }
    await BlogRepository.softDelete(id);
  },

  async toggleLike(blogId: number, userId: number) {
    const blog = await BlogRepository.findById(blogId);
    if (!blog || blog.is_deleted) {
      const err: any = new Error('Blog not found.'); err.status = 404; throw err;
    }
    const existing = await BlogRepository.findLike(userId, blogId);
    if (existing) {
      await BlogRepository.removeLike(userId, blogId);
    } else {
      await BlogRepository.addLike(userId, blogId);
    }
    const updated = await BlogRepository.findById(blogId);
    return { liked: !existing, likeCount: Number(updated?.like_count ?? 0) };
  },

  async getMyBlogs(userId: number) {
    return BlogRepository.findByUser(userId);
  },
};
