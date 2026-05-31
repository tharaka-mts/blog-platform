import { Router, Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { BlogController } from '../controllers/blog.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import upload from '../middlewares/upload.middleware';
import { verifyToken } from '../config/jwt';
import { AuthRequest } from '../types';

const router = Router();

// Optional auth — attaches req.user if token present, doesn't block
function optionalAuth(req: AuthRequest, _res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  if (authHeader?.startsWith('Bearer ')) {
    try { req.user = verifyToken(authHeader.split(' ')[1]); } catch { /* ignore */ }
  }
  next();
}

const blogValidation = [
  body('title').trim().isLength({ min: 3, max: 200 }).withMessage('Title must be 3–200 chars.'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 chars.'),
];

router.get('/',          optionalAuth,  BlogController.getBlogs);
router.get('/my-posts',  authMiddleware, BlogController.getMyBlogs);
router.get('/:id',       optionalAuth,  BlogController.getBlogById);
router.post('/',         authMiddleware, upload.single('image'), blogValidation, BlogController.createBlog);
router.put('/:id',       authMiddleware, upload.single('image'), blogValidation, BlogController.updateBlog);
router.delete('/:id',    authMiddleware, BlogController.deleteBlog);
router.post('/:id/like', authMiddleware, BlogController.toggleLike);

export default router;
