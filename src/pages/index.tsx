import { VStack, Text } from '@chakra-ui/react';
import Spinner from '@/components/atoms/Spinner';
import useUserSession from '@/lib/useUserSession';

const Home: React.FC = () => {
  useUserSession('/companies');

  return (
    <VStack py={8}>
      <Spinner />
      <Text>Filling up Siggy’s food bowl…</Text>
    </VStack>
  );
};

export default Home;
