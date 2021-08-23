const Input = {
  variants: {
    outline: {
      field: {
        borderColor: 'gray.200',
        bg: 'white',
        _focus: {
          borderColor: 'gray.400',
          boxShadow: `none`,
        },
      },
    },
  },
  defaultProps: {
    isRequired: false,
  },
};

export default Input;
