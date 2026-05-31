import { Router } from 'express';
import { body } from 'express-validator';
import { CommentController } from '../controllers/comment.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router({ mergeParams: true });

router.get('/',           CommentController.getComments);
router.post('/',          authMiddleware, [body('content').trim().notEmpty().withMessage('Content is required.')], CommentController.createComment);
router.put('/:commentId', authMiddleware, [body('content').trim().notEmpty().withMessage('Content is required.')], CommentController.updateComment);
router.delete('/:commentId', authMiddleware, CommentController.deleteComment);

export default router;
