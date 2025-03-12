import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';
import ApiError from '../components/ApiError';
import Error from '../components/Error';
import GuildSettingsForm from '../components/GuildSettingsForm';
import Loader from '../components/Loader';
import { getGuild } from '../data/guild';

const DISCORD_CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID;

export default function Guild() {
  const { guildId } = useParams();

  const {
    isLoading,
    data: guild,
    error,
  } = useQuery({
    queryKey: ['guild', guildId],
    queryFn: () => getGuild(guildId!),
  });

  if (isLoading) {
    return <Loader text='Loading server...' />;
  }

  if (error) {
    if (
      (error as any).response?.status === 404 &&
      (error as any).response.data.resource === 'userGuild'
    ) {
      return (
        <Error
          error='You are not in this server.'
          button={{ href: '/', text: 'Return to my servers' }}
        />
      );
    }

    if (
      (error as any).response?.status === 404 &&
      (error as any).response.data.resource === 'botGuild'
    ) {
      return (
        <Error
          error='Welcomer Bot is not in this server.'
          button={{
            text: 'Add bot to continue',
            href: `https://discord.com/oauth2/authorize?${new URLSearchParams({
              client_id: DISCORD_CLIENT_ID,
              scope: 'bot applications.commands',
              permissions: '8',
              guild_id: guildId!,
            })}`,
          }}
        />
      );
    }

    return <ApiError code={(error as any).status} />;
  }

  if (!guild) return <></>;

  return <GuildSettingsForm guild={guild} />;
}
