import { HStack, Box } from '@chakra-ui/react'
import Link from 'next/link'
import Logo from '../../atoms/Logo/Logo'
import Account from './Account'

const Header: React.FC = () => {
  return (
    <HStack
      borderBlockEnd="1px solid"
      borderBlockEndColor="gray.300"
      h="14"
      px={4}
    >
      <Link href="/" passHref>
        <a>
          <Logo h="32px" w="96px" />
        </a>
      </Link>

      <Box flex="1" justifyContent="flex-end" display="flex">
        <Account />
      </Box>
    </HStack>
  )
}

export default Header
