import { Router } from 'express';
import { VideoController } from '../controllers/video.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const videoController = new VideoController();

router.use(authMiddleware);

router.get('/:id', (req, res) => videoController.getById(req, res));
router.post('/:id/complete', (req, res) => videoController.complete(req, res));
router.post('/:id/progress', (req, res) => videoController.updateProgress(req, res));

export default router;
