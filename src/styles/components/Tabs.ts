const Tabs = {
  parts: ['root', 'tab', 'tablist'],
  variants: {
    custom: {
      root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      },
      tab: {
        color: 'gray.600',
        borderRadius: 'full',
        _hover: {
          bg: 'gray.100',
        },
        ':not(:last-child)': { mr: 1 },
        _selected: {
          bg: 'white',
        },
        fontSize: 'sm',
      },
      tablist: {
        display: 'flex',
        p: 1,
        bg: 'gray.200',
        borderRadius: 'full',
      },
    },
  },
  defaultProps: {
    variant: 'custom',
  },
};
export default Tabs;
