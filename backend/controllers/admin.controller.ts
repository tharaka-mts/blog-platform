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
};
