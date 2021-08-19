import { extendTheme } from '@chakra-ui/react';

const colors = {
  primary: '#00ffff',
  brand: {
    900: '#000000',
  },
};

export const theme = extendTheme({
  styles: {
    global: {
      '.js-focus-visible :focus:not([data-focus-visible-added])': {
        outline: 'none',
        boxShadow: 'none',
      },
    },
  },
  colors,
});
