import { Response, NextFunction } from 'express';
import { AdminService } from '../services/admin.service';
import { AuthRequest } from '../types';

export const AdminController = {

  async getUsers(_req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await AdminService.getUsers();
      res.json({ success: true, data: users });
    } catch (err) { next(err); }
  },

  async activateUser(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await AdminService.activateUser(Number(req.params['id']));
      res.json({ success: true, data: user });
    } catch (err) { next(err); }
  },

  async deactivateUser(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await AdminService.deactivateUser(Number(req.params['id']));
      res.json({ success: true, data: user });
    } catch (err) { next(err); }
  },

  async deleteUser(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await AdminService.deleteUser(Number(req.params['id']), req.user!.id);
      res.json({ success: true, message: 'User deleted.' });
    } catch (err) { next(err); }
  },

  async getDeletedUsers(_req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await AdminService.getDeletedUsers();
      res.json({ success: true, data: users });
    } catch (err) { next(err); }
  },

  async restoreUser(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await AdminService.restoreUser(Number(req.params['id']));
      res.json({ success: true, message: 'User restored.' });
    } catch (err) { next(err); }
  },

  async hardDeleteUser(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await AdminService.hardDeleteUser(Number(req.params['id']));
      res.json({ success: true, message: 'User permanently deleted.' });
    } catch (err) { next(err); }
  },

  async getDeletedBlogs(_req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const blogs = await AdminService.getDeletedBlogs();
      res.json({ success: true, data: blogs });
    } catch (err) { next(err); }
  },

  async restoreBlog(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await AdminService.restoreBlog(Number(req.params['id']));
      res.json({ success: true, message: 'Blog restored.' });
    } catch (err) { next(err); }
  },

  async hardDeleteBlog(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await AdminService.hardDeleteBlog(Number(req.params['id']));
      res.json({ success: true, message: 'Blog permanently deleted.' });
    } catch (err) { next(err); }
  }
};
