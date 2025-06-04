import type { GuildMember } from 'discord.js';
import api from '../../utils/api.js';

export default async function (member: GuildMember) {
  const userId = member.id;
  const guildId = member.guild.id;

  await api.delete(`/user/guild-session/${guildId}:${userId}`);
}
