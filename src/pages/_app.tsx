import { ChakraProvider } from '@chakra-ui/react';
import { AppComponent } from 'next/dist/next-server/lib/router/router';
import { theme } from '@/styles/theme';
import Header from '@/components/organisms/Header';
import { Provider as AuthProvider } from 'next-auth/client';
import 'focus-visible/dist/focus-visible';

const App: AppComponent = ({ Component, pageProps }) => {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider session={pageProps.session}>
        <Header />
        <Component {...pageProps} />
      </AuthProvider>
    </ChakraProvider>
  );
};
export default App;
