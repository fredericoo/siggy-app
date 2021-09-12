import { HStack, Box, Container } from '@chakra-ui/react';
import Link from 'next/link';
import Logo from '../../atoms/Logo/Logo';
import Account from './Account';

const Header: React.FC = () => {
  return (
    <Box
      position="sticky"
      top={0}
      borderBlockEnd="1px solid"
      bg="white"
      borderBlockEndColor="orange.200"
      boxShadow="0px 4px 30px 2px rgb(255,210,157, .3)"
      zIndex="sticky"
    >
      <Container maxW="container.lg">
        <HStack as="nav" spacing={8} h="14">
          <Link href="/" passHref>
            <a>
              <Logo h="32px" w="96px" />
            </a>
          </Link>

          <Box flex="1" justifyContent="flex-end" display="flex">
            <Account />
          </Box>
        </HStack>
      </Container>
    </Box>
  );
};

export default Header;
