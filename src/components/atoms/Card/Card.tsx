import { ComponentWithAs, StackProps, VStack } from '@chakra-ui/react';

type CardProps = {
  onSelect?: () => void;
  isSelected?: boolean;
};

const Card: ComponentWithAs<'div', StackProps & CardProps> = ({
  children,
  isSelected,
  ...props
}) => {
  return (
    <VStack
      as="button"
      textAlign="initial"
      borderRadius="xl"
      p={4}
      border="1px solid"
      borderColor={isSelected ? 'orange.200' : 'gray.200'}
      _hover={{ bg: isSelected ? 'orange.100' : 'gray.50' }}
      _active={{ bg: 'orange.100' }}
      bg={isSelected ? 'orange.50' : 'white'}
      cursor="pointer"
      {...props}
    >
      {children}
    </VStack>
  );
};

export default Card;
