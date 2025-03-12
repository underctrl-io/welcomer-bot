import { useMutation, useQuery } from '@tanstack/react-query';
import { ChannelType } from 'discord-api-types/v10';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { type APIGuild, getGuildChannels, updateGuild } from '../data/guild';
import ApiError from './ApiError';
import Loader from './Loader';

export default function GuildSettingsForm({ guild }: { guild: APIGuild }) {
  const {
    data: channels,
    isLoading: channelsLoading,
    error: channelsError,
  } = useQuery({
    queryKey: ['guild-channels', guild.id],
    queryFn: () => getGuildChannels(guild.id),
  });

  const { mutate: saveSettings, isPending: isSaving } = useMutation({
    mutationKey: ['update-guild', guild.id],
    mutationFn: (data: Partial<APIGuild>) => updateGuild(guild.id, data),
    onError: (error: any) => {
      console.error('Error saving guild settings', error);
      toast.error(
        error.response?.data?.error ||
          'Failed to save server settings. Please try again.'
      );
    },
    onSuccess: () => {
      toast.success('Server settings updated!');
    },
  });

  const [settings, setSettings] = useState({
    welcomeChannelId: guild.welcomeChannelId,
    welcomeMessage: guild.welcomeMessage,
  });

  if (channelsLoading) {
    return <Loader text='Loading channels...' />;
  }

  if (channelsError) {
    return <ApiError code={(channelsError as any).status} />;
  }

  if (!channels) return <></>;

  return (
    <div className='flex flex-col gap-8 max-w-lg mx-auto'>
      <div className='flex flex-col gap-2'>
        <label className='label text-sm' htmlFor='welcome-channel'>
          Configure welcome channel
        </label>
        <select
          defaultValue={settings.welcomeChannelId ?? 'Select a channel'}
          className='select w-full'
          id='welcome-channel'
          disabled={isSaving}
          onChange={(e) =>
            setSettings({
              ...settings,
              welcomeChannelId: e.target.value,
            })
          }
        >
          <option disabled>Select a channel</option>
          {channels
            .filter(
              (channel) =>
                channel.type === ChannelType.GuildText ||
                channel.type === ChannelType.GuildAnnouncement
            )
            .map((channel) => (
              <option key={channel.id} value={channel.id}>
                #{channel.name}
              </option>
            ))}
        </select>
      </div>

      <div className='flex flex-col gap-2'>
        <label className='label text-sm' htmlFor='welcome-message'>
          Configure welcome message
        </label>
        <textarea
          id='welcome-message'
          className='textarea w-full min-h-36'
          placeholder='Allowed placeholders: {username} {mention} {server}'
          maxLength={500}
          value={settings.welcomeMessage ?? ''}
          disabled={!settings.welcomeChannelId || isSaving}
          onChange={(e) =>
            setSettings({
              ...settings,
              welcomeMessage: e.target.value,
            })
          }
        />
      </div>

      <div className='flex justify-center gap-2'>
        <button
          className='btn'
          disabled={isSaving}
          onClick={() => {
            const newSettings = {
              welcomeChannelId: null,
              welcomeMessage: null,
            };
            setSettings(newSettings);
            saveSettings(newSettings);
          }}
        >
          Reset settings
        </button>
        <button
          className='btn btn-primary'
          onClick={() => saveSettings(settings)}
          disabled={isSaving}
        >
          {isSaving && <span className='loading loading-spinner loading-xs' />}
          Save settings
        </button>
      </div>
    </div>
  );
}
