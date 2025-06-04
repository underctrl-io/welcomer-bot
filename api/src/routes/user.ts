import { Router } from 'express';
import redis from '../lib/redis.js';
import botMiddleware from '../middleware/bot.js';

const router = Router();

router.delete('/guild-session/:key', botMiddleware, async (req, res) => {
  const key = req.params.key;

  await redis.del(`guildSession:${key}`);

  res.sendStatus(200);
});

export default router;
