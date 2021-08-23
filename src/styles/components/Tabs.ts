const Tabs = {
  parts: ['tab', 'tablist'],
  variants: {
    custom: {
      tab: {
        borderRadius: 'full',
        _hover: {
          bg: 'gray.100',
        },

        ':not(:last-child)': { mr: 1 },
        _selected: {
          bg: 'orange.200',
        },
        fontSize: 'sm',
      },
      tablist: {
        display: 'inline-flex',
        p: 1,
        bg: 'white',
        borderRadius: 'full',
      },
    },
  },
  defaultProps: {
    variant: 'custom',
  },
};
export default Tabs;
