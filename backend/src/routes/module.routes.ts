import { Router } from 'express';
import { ModuleController } from '../controllers/module.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const moduleController = new ModuleController();

router.use(authMiddleware);

router.get('/', (req, res) => moduleController.list(req, res));
router.get('/:id', (req, res) => moduleController.getById(req, res));

export default router;
