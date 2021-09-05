import { ComponentWithAs, StackProps, VStack } from '@chakra-ui/react';

type CardProps = {
  onSelect?: () => void;
  isSelected?: boolean;
};

const styles = {
  default: {
    bg: 'white',
    _hover: { bg: 'gray.50' },
    _active: { bg: 'orange.100' },
    borderColor: 'gray.200',
  },
  selected: {
    bg: 'orange.100',
    borderColor: 'orange.200',
    _hover: { bg: 'orange.100' },
  },
  disabled: {
    bg: 'gray.100',
    borderColor: 'gray.200',
    opacity: 0.5,
    cursor: 'initial',
  },
};

const Card: ComponentWithAs<'div', StackProps & CardProps> = ({
  children,
  isSelected,
  isDisabled,
  ...props
}) => {
  const stateStyles = isDisabled
    ? styles.disabled
    : isSelected
    ? styles.selected
    : styles.default;

  return (
    <VStack
      as="button"
      textAlign="initial"
      borderRadius="xl"
      p={4}
      border="1px solid"
      cursor="pointer"
      {...stateStyles}
      {...props}
    >
      {children}
    </VStack>
  );
};

export default Card;
