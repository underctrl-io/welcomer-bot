import { Router } from 'express';
import botMiddleware from '../middleware/bot.js';
import Guild from '../models/Guild.js';

const router = Router();

// http://localhost:3000/bot/guilds/{guildId}
router.get('/guilds/:guildId', botMiddleware, async (req, res) => {
  try {
    const guildId = req.params.guildId;
    let guild = await Guild.findOne({ id: guildId });

    if (!guild) {
      guild = new Guild({ id: guildId });
      await guild.save();
    }

    res.json(guild.toJSON());
  } catch (error) {
    console.error('Error in GET /bot/guilds/:guildId', error);
    res.sendStatus(500);
  }
});

export default router;
