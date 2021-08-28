import {
  Box,
  ComponentWithAs,
  Container,
  ContainerProps,
} from '@chakra-ui/react';

type ActionSheetProps = {
  footer?: React.ReactNode;
};

const ActionSheet: ComponentWithAs<'div', ActionSheetProps & ContainerProps> =
  ({ children, footer, ...props }) => {
    return (
      <Container
        maxW="container.lg"
        pt={4}
        pb={footer ? 0 : 4}
        bg="white"
        borderRadius="xl"
        {...props}
      >
        {children}
        {footer && (
          <Box
            position={{ base: 'sticky', md: 'static' }}
            bottom="0"
            py={4}
            bg="linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1) 50%)"
          >
            {footer}
          </Box>
        )}
      </Container>
    );
  };

export default ActionSheet;
