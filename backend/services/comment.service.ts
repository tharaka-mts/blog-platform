import { CommentRepository } from '../repositories/comment.repository';
import { BlogRepository } from '../repositories/blog.repository';
import { CreateCommentDTO } from '../types';

export const CommentService = {

  async getComments(blogId: number) {
    const blog = await BlogRepository.findById(blogId);
    if (!blog || blog.is_deleted) {
      const err: any = new Error('Blog not found.'); err.status = 404; throw err;
    }
    return CommentRepository.findByBlog(blogId);
  },

  async createComment(dto: CreateCommentDTO) {
    if (dto.parentCommentId) {
      const parent = await CommentRepository.findById(dto.parentCommentId);
      if (!parent) {
        const err: any = new Error('Parent comment not found.'); err.status = 404; throw err;
      }
    }
    const id = await CommentRepository.create(dto);
    return CommentRepository.findById(id);
  },

  async updateComment(commentId: number, userId: number, role: string, content: string) {
    const comment = await CommentRepository.findById(commentId);
    if (!comment || comment.is_deleted) {
      const err: any = new Error('Comment not found.'); err.status = 404; throw err;
    }
    if (comment.user_id !== userId && role !== 'ADMIN') {
      const err: any = new Error('You can only edit your own comments.'); err.status = 403; throw err;
    }
    await CommentRepository.update(commentId, content);
    return CommentRepository.findById(commentId);
  },

  async deleteComment(commentId: number, userId: number, role: string) {
    const comment = await CommentRepository.findById(commentId);
    if (!comment || comment.is_deleted) {
      const err: any = new Error('Comment not found.'); err.status = 404; throw err;
    }
    if (comment.user_id !== userId && role !== 'ADMIN') {
      const err: any = new Error('You can only delete your own comments.'); err.status = 403; throw err;
    }
    await CommentRepository.softDelete(commentId);
  },
};
