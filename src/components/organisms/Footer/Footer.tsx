import { Container } from '@chakra-ui/react';

const Footer: React.VFC = () => {
  return (
    <Container
      py={8}
      maxW="container.lg"
      fontSize="sm"
      textAlign="center"
      color="gray.400"
    >
      Designed by Lara Luz & developed by @fredericoo
    </Container>
  );
};

export default Footer;
