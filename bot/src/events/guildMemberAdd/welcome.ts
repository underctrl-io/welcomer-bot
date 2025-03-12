import type { GuildMember } from 'discord.js';
import api from '../../utils/api.js';

type APIGuild = {
  id: string;
  welcomeChannelId: string | null;
  welcomeMessage: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export default async (member: GuildMember) => {
  try {
    const guildConfigRes = await api.get<APIGuild>(
      `/bot/guilds/${member.guild.id}`
    );

    if (!guildConfigRes) {
      console.log(
        `/simulate-join: No guild config found for "${member.guild.name}"`
      );
      return;
    }

    const guildConfig = guildConfigRes.data;

    if (!guildConfig.welcomeChannelId) {
      console.log(
        `/simulate-join: No welcome channel found for "${member.guild.name}"`
      );
      return;
    }

    const welcomeChannel =
      member.guild.channels.cache.get(guildConfig.welcomeChannelId) ||
      (await member.guild.channels.fetch(guildConfig.welcomeChannelId));

    if (!welcomeChannel?.isSendable()) {
      console.log(
        `/simulate-join: Welcome channel does not exist, or is not sendable for "${member.guild.name}"`
      );
      return;
    }

    if (guildConfig.welcomeMessage) {
      welcomeChannel.send(
        guildConfig.welcomeMessage
          .replace('{mention}', member.toString())
          .replace('{username}', member.user.username)
          .replace('{server}', member.guild.name)
      );
    } else {
      welcomeChannel.send(`Welcome ${member} to ${member.guild.name}!`);
    }

    console.log(
      `/simulate-join: Welcome message sent to "${member.guild.name}"`
    );
  } catch (error) {
    console.error('Error in guildMemberAdd/welcome', error);
  }
};
