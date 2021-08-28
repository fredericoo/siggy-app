import Message from '@/components/molecules/Message';
import { Box } from '@chakra-ui/react';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/dist/client/router';

const UnauthorisedMessage: React.VFC = () => {
  const [session, loading] = useSession();
  const { push } = useRouter();

  return (
    <Box p={4}>
      <Message
        heading="Not found"
        body="This page cannot be displayed because it doesn’t exist or you do not have permission to view it"
        action={!session && !loading ? 'Log in' : undefined}
        onClick={() => {
          push('/api/auth/signin');
        }}
      />
    </Box>
  );
};

export default UnauthorisedMessage;
