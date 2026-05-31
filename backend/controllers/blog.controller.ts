import { Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { BlogService } from '../services/blog.service';
import { AuthRequest } from '../types';

export const BlogController = {

  async getBlogs(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const page     = Math.max(1, parseInt(req.query['page']     as string) || 1);
      const pageSize = Math.min(50, parseInt(req.query['pageSize'] as string) || 5);
      const keyword  = (req.query['keyword'] as string) || '';
      const sort     = (req.query['sort']    as string) || 'newest';
      const { rows, total } = await BlogService.getBlogs({ page, pageSize, keyword, sort });
      res.json({ success: true, data: rows, meta: { total, page, pageSize } });
    } catch (err) { next(err); }
  },

  async getBlogById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const blog = await BlogService.getBlogById(Number(req.params['id']), req.user?.id);
      res.json({ success: true, data: blog });
    } catch (err) { next(err); }
  },

  async getMyBlogs(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const blogs = await BlogService.getMyBlogs(req.user!.id);
      res.json({ success: true, data: blogs });
    } catch (err) { next(err); }
  },

  async createBlog(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { next(errors.array()); return; }
    try {
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
      const blog = await BlogService.createBlog({
        userId: req.user!.id,
        title:       req.body.title,
        description: req.body.description,
        imageUrl,
      });
      res.status(201).json({ success: true, data: blog });
    } catch (err) { next(err); }
  },

  async updateBlog(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { next(errors.array()); return; }
    try {
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
      const blog = await BlogService.updateBlog(
        Number(req.params['id']), req.user!.id, req.user!.role,
        { title: req.body.title, description: req.body.description, imageUrl }
      );
      res.json({ success: true, data: blog });
    } catch (err) { next(err); }
  },

  async deleteBlog(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await BlogService.deleteBlog(Number(req.params['id']), req.user!.id, req.user!.role);
      res.json({ success: true, message: 'Blog deleted.' });
    } catch (err) { next(err); }
  },

  async toggleLike(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await BlogService.toggleLike(Number(req.params['id']), req.user!.id);
      res.json({ success: true, data: result });
    } catch (err) { next(err); }
  },
};
