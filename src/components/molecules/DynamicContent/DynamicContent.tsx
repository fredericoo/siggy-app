import { VStack, Text } from '@chakra-ui/react';
import Message from '../Message';
import Spinner from '@/components/atoms/Spinner';

type DynamicContentProps = {
  isLoading?: boolean;
  loadingMessage?: string;
  isError?: boolean;
  errorMessage?: string;
};

const DynamicContent: React.FC<DynamicContentProps> = ({
  isLoading,
  loadingMessage,
  isError,
  errorMessage,
  children,
}) => {
  if (isError)
    return (
      <Message heading="Oops" body={errorMessage || 'an error occurred.'} />
    );
  if (isLoading)
    return (
      <VStack minH="128px">
        <Spinner />
        <Text fontSize="sm">{loadingMessage || 'Loading'}</Text>
      </VStack>
    );
  return <>{children}</>;
};

export default DynamicContent;
