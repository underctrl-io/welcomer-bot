import { useQuery } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { userAtom } from '../atoms/user';
import { getCurrentUser } from '../data/user';
import ApiError from './ApiError';
import Loader from './Loader';

export default function AuthProvider({ children }: React.PropsWithChildren) {
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
  });

  const [, setUser] = useAtom(userAtom);

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user]);

  if (isLoading) {
    return <Loader text='Loading user...' />;
  }

  if (error) {
    return <ApiError code={(error as any).status} />;
  }

  return <>{children}</>;
}
