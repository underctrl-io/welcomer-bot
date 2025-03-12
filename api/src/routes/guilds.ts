import { AxiosError } from 'axios';
import { PermissionsBitField } from 'discord.js';
import { Router } from 'express';
import guildSessionMiddleware from '../middleware/guild-session.js';
import Guild from '../models/Guild.js';
import User from '../models/User.js';
import type { AuthRequest } from '../types.js';
import {
  getAccessToken,
  getGuildChannels,
  getUserGuilds,
} from '../utils/discord-api.js';

const router = Router();

// http://localhost:3000/guilds
router.get('/', async (req, res) => {
  try {
    const reqUser = (req as AuthRequest).user!;

    const user = await User.findOne({ id: reqUser.id });

    if (!user) {
      res.sendStatus(401);
      return;
    }

    const accessToken = await getAccessToken(user);
    const guilds = await getUserGuilds(accessToken);

    const filteredGuilds = guilds.filter((guild) =>
      new PermissionsBitField(BigInt(guild.permissions)).has('ManageGuild')
    );

    res.json(filteredGuilds);
  } catch (error) {
    if (error instanceof AxiosError) {
      res.sendStatus(error.response?.status || 500);
      return;
    }
    console.error('Error in GET /guilds', error);
    res.sendStatus(500);
  }
});

// http://localhost:3000/guilds/{guildId}
router.get('/:guildId', guildSessionMiddleware, async (req, res) => {
  try {
    const guildId = req.params.guildId;
    let guild = await Guild.findOne({ id: guildId });

    if (!guild) {
      guild = new Guild({ id: guildId });
      await guild.save();
    }

    res.json(guild.toJSON());
  } catch (error) {
    console.error('Error in GET /guilds/:guildId', error);
    res.sendStatus(500);
  }
});

router.put('/:guildId', guildSessionMiddleware, async (req, res) => {
  try {
    const guildId = req.params.guildId!;
    const { welcomeChannelId, welcomeMessage } = req.body;

    if (welcomeMessage && !welcomeChannelId) {
      res.status(400).json({
        error: 'Welcome channel is required when welcome message is set',
      });
      return;
    }

    if (welcomeMessage && welcomeMessage.length > 500) {
      res.status(400).json({
        error: 'Welcome message must be less than 500 characters',
      });
      return;
    }

    await Guild.findOneAndUpdate(
      { id: guildId },
      { welcomeChannelId, welcomeMessage },
      { upsert: true }
    );

    res.sendStatus(200);
  } catch (error) {
    console.error('Error in PUT /guilds/:guildId', error);
    res.sendStatus(500);
  }
});

// http://localhost:3000/guilds/{guildId}/channels
router.get('/:guildId/channels', guildSessionMiddleware, async (req, res) => {
  try {
    const guildId = req.params.guildId!;
    const channels = await getGuildChannels(guildId);

    res.json(channels);
  } catch (error) {
    if (error instanceof AxiosError) {
      res.sendStatus(error.response?.status || 500);
      return;
    }

    console.error('Error in GET /guilds/:guildId/channels', error);
    res.sendStatus(500);
  }
});

export default router;
