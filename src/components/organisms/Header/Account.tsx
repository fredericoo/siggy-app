import React from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/client';
import {
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';
import Image from 'next/image';

const Account: React.FC = () => {
  const [session, loading] = useSession();

  if (loading) return null;

  if (session) {
    return (
      <Menu>
        <MenuButton>
          <HStack justify="flex-end">
            {session.user?.image && (
              <Image
                src={session.user?.image}
                width={32}
                height={32}
                alt={`${session.user?.name}'s avatar`}
              />
            )}
            <Text>{session.user?.name}</Text>
          </HStack>
        </MenuButton>
        <MenuList>
          <MenuItem onClick={() => signOut()}>Log Out</MenuItem>
        </MenuList>
      </Menu>
    );
  }

  return (
    <Link href="/api/auth/signin" passHref>
      <Button variant="ghost">Log in</Button>
    </Link>
  );
};

export default Account;
