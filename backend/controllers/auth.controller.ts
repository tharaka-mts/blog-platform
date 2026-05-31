import { Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { AuthService } from '../services/auth.service';
import { AuthRequest } from '../types';

export const AuthController = {

  async register(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { next(errors.array()); return; }

    try {
      const user = await AuthService.register(req.body);
      res.status(201).json({ success: true, data: user });
    } catch (err) { next(err); }
  },

  async login(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { next(errors.array()); return; }

    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      res.json({ success: true, data: result });
    } catch (err) { next(err); }
  },

  async me(req: AuthRequest, res: Response): Promise<void> {
    res.json({ success: true, data: req.user });
  },

  async updateProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { next(errors.array()); return; }
    try {
      const result = await AuthService.updateProfile(req.user!.id, req.body.username);
      res.json({ success: true, data: result, message: 'Profile updated successfully.' });
    } catch (err) { next(err); }
  },

  async updatePassword(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { next(errors.array()); return; }
    try {
      await AuthService.updatePassword(req.user!.id, req.body.oldPassword, req.body.newPassword);
      res.json({ success: true, message: 'Password updated successfully.' });
    } catch (err) { next(err); }
  },
};

