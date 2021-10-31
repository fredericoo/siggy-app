const Menu = {
  parts: ['list', 'item'],
  variants: {
    custom: {
      list: {
        borderRadius: 'xl',
        p: 1,
        boxShadow: 'md',
        _focus: {
          boxShadow: 'md',
        },
      },
      item: {
        borderRadius: 'lg',
        _hover: {
          bg: 'orange.200',
        },
        _focus: {
          bg: 'orange.200',
        },
      },
    },
  },
  defaultProps: {
    variant: 'custom',
  },
};

export default Menu;
