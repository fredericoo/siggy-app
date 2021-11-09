const Button = {
  defaultProps: {
    variant: 'secondary',
  },
  baseStyle: {
    borderRadius: 'lg',
  },
  sizes: {
    md: {
      height: 'auto',
      py: 2,
      px: 4,
    },
    lg: {
      height: 'auto',
      py: 4,
      px: 8,
    },
  },
  variants: {
    primary: {
      bg: 'orange.200',
      border: '1px solid',
      borderColor: 'orange.300',
      _hover: {
        bg: 'orange.300',
      },
      _active: {
        bg: 'orange.400',
      },
    },
    secondary: {
      bg: 'gray.100',
      border: '1px solid',
      borderColor: 'gray.200',
      _hover: {
        bg: 'gray.200',
      },
      _active: {
        bg: 'gray.300',
      },
    },
    danger: {
      bg: 'red.200',
      _hover: {
        bg: 'red.300',
      },
      _active: {
        bg: 'red.400',
      },
    },
  },
};

export default Button;
