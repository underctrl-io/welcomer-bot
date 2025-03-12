import Error from './Error';

const API_URL = import.meta.env.VITE_API_URL;

export default function APIError({ code }: { code: number }) {
  if (code === 401) {
    return (
      <Error
        error='Unauthorized! Please login to continue.'
        button={{
          href: API_URL + '/auth/login',
          text: 'Login with Discord',
          variant: 'primary',
        }}
      />
    );
  }

  if (code === 429) {
    return <Error error='Too many requests! Please try again later.' />;
  }

  if (code === 403) {
    return (
      <Error
        error='You do not have enough permission to access this resource.'
        button={{
          href: '/',
          text: 'Return to my servers',
        }}
      />
    );
  }

  if (code === 404) {
    return (
      <Error
        error='Could not find that resource.'
        button={{
          href: '/',
          text: 'Return to my servers',
        }}
      />
    );
  }

  return (
    <Error error='There was an unexpected error. Please try again later.' />
  );
}
