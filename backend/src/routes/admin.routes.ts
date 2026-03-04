import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminMiddleware } from '../middlewares/admin.middleware';

const router = Router();
const adminController = new AdminController();

router.use(authMiddleware, adminMiddleware);

router.get('/stats', (req, res) => adminController.getStats(req as any, res));
router.get('/users', (req, res) => adminController.listUsers(req as any, res));

router.post('/modules', (req, res) => adminController.createModule(req as any, res));
router.put('/modules/:id', (req, res) => adminController.updateModule(req as any, res));
router.delete('/modules/:id', (req, res) => adminController.deleteModule(req as any, res));

router.post('/videos', (req, res) => adminController.createVideo(req as any, res));
router.put('/videos/:id', (req, res) => adminController.updateVideo(req as any, res));
router.delete('/videos/:id', (req, res) => adminController.deleteVideo(req as any, res));

export default router;
