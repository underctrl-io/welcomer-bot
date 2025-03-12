import axios from 'axios';

const { API_URL, DISCORD_BOT_TOKEN } = process.env;

if (!API_URL || !DISCORD_BOT_TOKEN) {
  throw new Error('API_URL or DISCORD_BOT_TOKEN is not defined');
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${DISCORD_BOT_TOKEN}`,
  },
});

export default api;
