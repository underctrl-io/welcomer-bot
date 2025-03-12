import { Router } from 'express';
import authRoutes from './routes/auth.js';
import guildsRoutes from './routes/guilds.js';
import botGuildRoutes from './routes/bot/guild.js';
import authMiddleware from './middleware/auth.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/guilds', authMiddleware, guildsRoutes);
router.use('/bot/guilds', botGuildRoutes);

export default router;
