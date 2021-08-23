const Select = {
  variants: {
    outline: {
      field: {
        borderColor: '#BEC3CE',
        _focus: {
          borderColor: 'primary.500',
          boxShadow: `none`,
        },
      },
    },
  },
};

export default Select;
