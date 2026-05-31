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

export default router;
