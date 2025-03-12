import 'dotenv/config';
import { Client, IntentsBitField } from 'discord.js';
import { CommandKit } from 'commandkit';
import { join } from 'node:path';

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

const { DEV_USER_IDS, DEV_GUILD_IDS, DISCORD_BOT_TOKEN } = process.env;

new CommandKit({
  client,
  eventsPath: join(import.meta.dirname, 'events'),
  commandsPath: join(import.meta.dirname, 'commands'),
  devUserIds: DEV_USER_IDS?.split(',') || [],
  devGuildIds: DEV_GUILD_IDS?.split(',') || [],
  bulkRegister: true,
});

client.login(DISCORD_BOT_TOKEN);
