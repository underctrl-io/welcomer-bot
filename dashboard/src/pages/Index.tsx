import { useQuery } from '@tanstack/react-query';
import { RESTGetAPICurrentUserGuildsResult } from 'discord-api-types/v10';
import { useAtom } from 'jotai';
import { Link } from 'react-router';
import { userAtom } from '../atoms/user';
import ApiError from '../components/ApiError';
import Loader from '../components/Loader';
import { getGuilds } from '../data/guild';

export default function Index() {
  const {
    data: guilds,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['guilds'],
    queryFn: getGuilds,
    refetchOnMount: false,
  });

  const [user] = useAtom(userAtom);

  if (!user) return <></>;

  if (isLoading) {
    return <Loader text='Loading servers...' />;
  }

  if (error) {
    return <ApiError code={(error as any).status} />;
  }

  return (
    <div>
      <div className='space-y-3 mb-8'>
        <h2 className='text-3xl font-semibold'>Hey {user.username}! 👋</h2>
        <p className='text-base-content/50 text-lg'>
          Select a server below to get started
        </p>
      </div>

      {!guilds?.length ? (
        <div className='text-base-content/50 text-lg'>
          You are not in any servers with the "Manage Guild" permission.
        </div>
      ) : (
        <GuildsGrid guilds={guilds} />
      )}
    </div>
  );
}

function GuildsGrid({ guilds }: { guilds: RESTGetAPICurrentUserGuildsResult }) {
  return (
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
      {guilds.map((guild) => (
        <Link
          key={guild.id}
          to={`/guild/${guild.id}`}
          className='card card-border hover:bg-base-200 transition-colors'
        >
          <div className='flex items-center gap-2 card-body'>
            <img
              src={
                guild.icon
                  ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
                  : '/fallback-icon.webp'
              }
              alt={guild.name}
              className='size-16 rounded-full'
            />
            <div className='line-clamp-1 font-medium text-center'>
              {guild.name}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
