import { Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { CommentService } from '../services/comment.service';
import { AuthRequest } from '../types';

export const CommentController = {

  async getComments(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const comments = await CommentService.getComments(Number(req.params['blogId']));
      res.json({ success: true, data: comments });
    } catch (err) { next(err); }
  },

  async createComment(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { next(errors.array()); return; }
    try {
      const comment = await CommentService.createComment({
        blogId:          Number(req.params['blogId']),
        userId:          req.user!.id,
        content:         req.body.content,
        parentCommentId: req.body.parentCommentId || null,
      });
      res.status(201).json({ success: true, data: comment });
    } catch (err) { next(err); }
  },

  async updateComment(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { next(errors.array()); return; }
    try {
      const comment = await CommentService.updateComment(
        Number(req.params['commentId']), req.user!.id, req.user!.role, req.body.content
      );
      res.json({ success: true, data: comment });
    } catch (err) { next(err); }
  },

  async deleteComment(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await CommentService.deleteComment(
        Number(req.params['commentId']), req.user!.id, req.user!.role
      );
      res.json({ success: true, message: 'Comment deleted.' });
    } catch (err) { next(err); }
  },
};
