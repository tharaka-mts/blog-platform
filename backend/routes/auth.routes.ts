import { Router } from 'express';
import { body } from 'express-validator';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', [
  body('username').trim().isLength({ min: 3, max: 50 }).withMessage('Username must be 3–50 characters.'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required.'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
], AuthController.register);

router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required.'),
  body('password').notEmpty().withMessage('Password is required.'),
], AuthController.login);

router.get('/me', authMiddleware, AuthController.me);

router.put('/profile', authMiddleware, [
  body('username').trim().isLength({ min: 3, max: 50 }).withMessage('Username must be 3–50 characters.'),
], AuthController.updateProfile);

router.put('/password', authMiddleware, [
  body('oldPassword').notEmpty().withMessage('Current password is required.'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters.'),
], AuthController.updatePassword);

export default router;
