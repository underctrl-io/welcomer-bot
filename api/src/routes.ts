import { Router } from 'express';
import authMiddleware from './middleware/auth.js';
import authRoutes from './routes/auth.js';
import botRoutes from './routes/bot.js';
import guildsRoutes from './routes/guilds.js';
import userRoutes from './routes/user.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/guilds', authMiddleware, guildsRoutes);
router.use('/bot', botRoutes);
router.use('/user', userRoutes);

export default router;
