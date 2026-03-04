import { Router } from 'express';
import { ProgressController } from '../controllers/progress.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const progressController = new ProgressController();

router.use(authMiddleware);

router.get('/', (req, res) => progressController.getOverall(req, res));
router.get('/module/:moduleId', (req, res) => progressController.getByModule(req, res));

export default router;
