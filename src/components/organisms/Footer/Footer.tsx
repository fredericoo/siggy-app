import { Container, List, ListItem } from '@chakra-ui/react';

const Footer: React.VFC = () => {
  return (
    <Container py={8} maxW="container.lg">
      <List>
        <ListItem>Terms of Service</ListItem>
      </List>
    </Container>
  );
};

export default Footer;
