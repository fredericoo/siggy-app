import { Box, keyframes } from '@chakra-ui/react';
import LoadingIcon from './LoadingIcon';

const spin = keyframes({
  '0%': {
    transform: 'rotate(0deg)',
  },
  '100%': {
    transform: 'rotate(360deg)',
  },
});

const Spinner: React.VFC<{ size?: number }> = ({ size = 8 }) => {
  return (
    <Box w={size} h={size} animation={`${spin} 1s linear infinite`} color="gray.600">
      <LoadingIcon />
    </Box>
  );
};

Spinner.displayName = 'Spinner';

export default Spinner;
