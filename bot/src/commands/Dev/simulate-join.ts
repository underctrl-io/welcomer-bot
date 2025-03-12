import type { CommandOptions, SlashCommandProps } from 'commandkit';
import {
  type GuildMember,
  InteractionContextType,
  SlashCommandBuilder,
} from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('simulate-join')
  .setDescription('Simulates a user joining a guild')
  .setContexts(InteractionContextType.Guild)
  .addUserOption((option) =>
    option
      .setName('member')
      .setDescription('The member to simulate joining the guild')
  );

export const run = ({ interaction, client }: SlashCommandProps) => {
  const targetMember = (interaction.options.getMember('member') ||
    interaction.member) as GuildMember;

  if (!targetMember) {
    interaction.reply({ content: 'Invalid member', ephemeral: true });
    return;
  }

  client.emit('guildMemberAdd', targetMember);

  interaction.reply({
    content: `Simulated join for ${targetMember.user.username}`,
    ephemeral: true,
  });
};

export const options: CommandOptions = {
  // https://commandkit.js.org/docs/api-reference/types/CommandOptions
  devOnly: true,
};
