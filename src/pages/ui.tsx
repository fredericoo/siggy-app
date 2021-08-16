import { Button, Container, VStack } from '@chakra-ui/react';

const UiTestPage: React.VFC = () => {
  return (
    <Container py={8} maxW="container.lg">
      Hello
      <VStack>
        <Button>Default Button</Button>
        <Button size="lg">Large Button</Button>
        <Button size="sm">Small Button</Button>
        <Button variant="link">Link Button</Button>
        <Button variant="ghost">Ghost Button</Button>
        <Button variant="outline">Outline Button</Button>
      </VStack>
    </Container>
  );
};

export default UiTestPage;
