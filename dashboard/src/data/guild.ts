import axios from 'axios';
import type {
  RESTGetAPICurrentUserGuildsResult,
  RESTGetAPIGuildChannelsResult,
} from 'discord-api-types/v10';

const API_URL = import.meta.env.VITE_API_URL;

export type APIGuild = {
  id: string;
  welcomeChannelId: string | null;
  welcomeMessage: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export async function getGuilds() {
  const { data } = await axios.get<RESTGetAPICurrentUserGuildsResult>(
    `${API_URL}/guilds`,
    {
      withCredentials: true,
    }
  );

  return data;
}

export async function getGuild(id: string) {
  const { data } = await axios.get<APIGuild>(`${API_URL}/guilds/${id}`, {
    withCredentials: true,
  });

  return data;
}

export async function getGuildChannels(id: string) {
  const { data } = await axios.get<RESTGetAPIGuildChannelsResult>(
    `${API_URL}/guilds/${id}/channels`,
    {
      withCredentials: true,
    }
  );

  return data;
}

export async function updateGuild(id: string, data: Partial<APIGuild>) {
  await axios.put(`${API_URL}/guilds/${id}`, data, {
    withCredentials: true,
  });
}
