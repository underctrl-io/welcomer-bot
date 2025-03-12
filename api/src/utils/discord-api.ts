import axios from 'axios';
import type {
  RESTGetAPICurrentUserGuildsResult,
  RESTGetAPIGuildResult,
  RESTPostOAuth2RefreshTokenResult,
  RESTGetAPIGuildChannelsResult,
} from 'discord-api-types/v10';
import type { UserDocument } from '../models/User.js';

const { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_BOT_TOKEN } =
  process.env;

if (!DISCORD_CLIENT_ID || !DISCORD_CLIENT_SECRET || !DISCORD_BOT_TOKEN) {
  throw new Error(
    'DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET or DISCORD_BOT_TOKEN is not defined'
  );
}

export const getAccessToken = async (user: UserDocument) => {
  const { accessToken, accessTokenExpiresAt, refreshToken } = user;

  if (
    accessToken &&
    accessTokenExpiresAt &&
    accessTokenExpiresAt > new Date()
  ) {
    return accessToken;
  }

  if (!refreshToken) {
    throw new Error('No refresh token found');
  }

  const tokenRes = await axios.post<RESTPostOAuth2RefreshTokenResult>(
    'https://discord.com/api/v10/oauth2/token',
    {
      client_id: DISCORD_CLIENT_ID,
      client_secret: DISCORD_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }
  );

  const { access_token, expires_in, refresh_token } = tokenRes.data;

  user.accessToken = access_token;
  user.accessTokenExpiresAt = new Date(Date.now() + expires_in * 1000);
  user.refreshToken = refresh_token;

  await user.save();
  return access_token;
};

export const getUserGuilds = async (accessToken: string) => {
  const guildsRes = await axios.get<RESTGetAPICurrentUserGuildsResult>(
    'https://discord.com/api/v10/users/@me/guilds',
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return guildsRes.data;
};

export const getGuild = async (guildId: string) => {
  try {
    const guildRes = await axios.get<RESTGetAPIGuildResult>(
      `https://discord.com/api/v10/guilds/${guildId}`,
      {
        headers: {
          Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
        },
      }
    );

    return guildRes.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }

    throw error;
  }
};

export const getGuildChannels = async (guildId: string) => {
  const channelsRes = await axios.get<RESTGetAPIGuildChannelsResult>(
    `https://discord.com/api/v10/guilds/${guildId}/channels`,
    {
      headers: {
        Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
      },
    }
  );

  return channelsRes.data;
};
