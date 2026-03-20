import { Router } from 'express';
import { ChatController } from '../controllers/chat.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const chatController = new ChatController();

router.post('/message', authMiddleware, (req, res) => chatController.sendMessage(req, res));

export default router;
