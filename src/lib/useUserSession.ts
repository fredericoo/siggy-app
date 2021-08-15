import { useSession } from 'next-auth/client';
import { useRouter } from 'next/dist/client/router';
import { useEffect } from 'react';

const useUserSession = (): ReturnType<typeof useSession> => {
  const [session, loading] = useSession();
  const { push } = useRouter();

  useEffect(() => {
    if (!loading) {
      if (session) {
        push('/companies');
      } else {
        push('/api/auth/signin');
      }
    }
  }, [loading, session, push]);

  return [session, loading];
};
export default useUserSession;
