import { HStack, Box, Link as ChakraLink } from '@chakra-ui/react';
import Link from 'next/link';
import Logo from '../../atoms/Logo/Logo';
import Account from './Account';

const menuOptions = [{ label: 'Companies', href: '/companies' }];

const Header: React.FC = () => {
  return (
    <HStack
      as="nav"
      borderBlockEnd="1px solid"
      borderBlockEndColor="gray.300"
      h="14"
      px={4}
      spacing={8}
    >
      <Link href="/" passHref>
        <a>
          <Logo h="32px" w="96px" />
        </a>
      </Link>

      <HStack as="ul">
        {menuOptions.map(({ href, label }) => (
          <Link href={href} key={label + href} passHref>
            <ChakraLink>{label}</ChakraLink>
          </Link>
        ))}
      </HStack>

      <Box flex="1" justifyContent="flex-end" display="flex">
        <Account />
      </Box>
    </HStack>
  );
};

export default Header;
