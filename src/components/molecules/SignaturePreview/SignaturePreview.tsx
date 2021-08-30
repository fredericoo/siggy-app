import { Box, Circle, HStack, SkeletonText, Text } from '@chakra-ui/react';

type SignaturePreviewProps = {
  html: string;
};

const SignaturePreview: React.VFC<SignaturePreviewProps> = ({ html }) => {
  const buttonSize = '.8rem';
  return (
    <Box
      borderRadius="lg"
      bg="white"
      maxW="600px"
      overflow="hidden"
      mb={4}
      boxShadow="xl"
    >
      <HStack bg="gray.200" px={4} py={1} userSelect="none">
        <HStack flex="1" spacing={1}>
          {Array(3)
            .fill('button')
            .map((_, key) => (
              <Circle key={key} w={buttonSize} h={buttonSize} bg="gray.300" />
            ))}
        </HStack>
        <Box color="gray.600" flexGrow={1} fontSize="sm" textAlign="center">
          Email message
        </Box>
        <Box flex="1" />
      </HStack>
      <Box p={4}>
        <SkeletonText mb={4} noOfLines={3} speed={0} endColor="gray.200" />
        <SkeletonText mb={4} noOfLines={4} speed={0} endColor="gray.200" />
        <Text mb={4}>Looking forward to hearing from you!</Text>
        <Box
          dangerouslySetInnerHTML={{
            __html: html,
          }}
        />
      </Box>
    </Box>
  );
};
export default SignaturePreview;
