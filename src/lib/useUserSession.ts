import { useSession } from 'next-auth/client';
import { useRouter } from 'next/dist/client/router';
import { useEffect } from 'react';

const useUserSession = (redirectTo?: string): ReturnType<typeof useSession> => {
  const [session, loading] = useSession();
  const { push } = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!session) {
        push('/api/auth/signin');
      } else {
        redirectTo && push(redirectTo);
      }
    }
  }, [loading, session, push, redirectTo]);

  return [session, loading];
};
export default useUserSession;
