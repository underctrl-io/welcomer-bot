import { AxiosError } from 'axios';
import { PermissionsBitField } from 'discord.js';
import type { NextFunction, Request, Response } from 'express';
import redis from '../lib/redis.js';
import User from '../models/User.js';
import type { AuthRequest } from '../types.js';
import {
  getAccessToken,
  getGuild,
  getUserGuilds,
} from '../utils/discord-api.js';

const guildSessionMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reqUser = (req as AuthRequest).user!;
    const { id: userId } = reqUser;
    const { guildId } = req.params;

    if (!guildId) {
      console.error(
        `guildSessionMiddleware was used on a route that does not have a guildId parameter. Request URL: ${req.originalUrl}`
      );
      res.sendStatus(500);
      return;
    }

    const cachedSession = await redis.get(`guildSession:${guildId}:${userId}`);

    if (cachedSession) {
      next();
      return;
    }

    const user = await User.findOne({ id: userId });

    if (!user) {
      res.sendStatus(401);
      return;
    }

    const accessToken = await getAccessToken(user);
    const userGuilds = await getUserGuilds(accessToken);
    const userGuild = userGuilds.find((g) => g.id === guildId);

    if (!userGuild) {
      // client is not in the guild
      res.status(404).json({ resource: 'userGuild' });
      return;
    }

    const userPermissions = new PermissionsBitField(
      BigInt(userGuild.permissions)
    );

    if (!userPermissions.has('ManageGuild')) {
      res.sendStatus(403);
      return;
    }

    const botGuild = await getGuild(guildId);

    if (!botGuild) {
      // client will be asked to invite bot to the guild
      res.status(404).json({ resource: 'botGuild' });
      return;
    }

    await redis.set(
      `guildSession:${guildId}:${userId}`,
      JSON.stringify(userGuild),
      'EX',
      60 * 5
    );

    next();
  } catch (error) {
    if (error instanceof AxiosError) {
      res.sendStatus(error.response?.status || 500);
      return;
    }

    console.error('Error in guildSessionMiddleware', error);
    res.sendStatus(500);
  }
};

export default guildSessionMiddleware;
