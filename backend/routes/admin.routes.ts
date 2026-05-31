import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';

const router = Router();

router.use(authMiddleware, requireRole('ADMIN'));

router.get('/users',                  AdminController.getUsers);
router.put('/users/:id/activate',     AdminController.activateUser);
router.put('/users/:id/deactivate',   AdminController.deactivateUser);
router.delete('/users/:id',           AdminController.deleteUser);

// Recycle Bin Routes
router.get('/bin/users',              AdminController.getDeletedUsers);
router.put('/bin/users/:id/restore',  AdminController.restoreUser);
router.delete('/bin/users/:id/hard',  AdminController.hardDeleteUser);

router.get('/bin/blogs',              AdminController.getDeletedBlogs);
router.put('/bin/blogs/:id/restore',  AdminController.restoreBlog);
router.delete('/bin/blogs/:id/hard',  AdminController.hardDeleteBlog);

export default router;
