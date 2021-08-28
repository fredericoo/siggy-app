import { Box, ChakraProvider } from '@chakra-ui/react';
import { AppComponent } from 'next/dist/next-server/lib/router/router';
import { theme } from '@/styles/theme';
import Header from '@/components/organisms/Header';
import { Provider as AuthProvider } from 'next-auth/client';
import 'focus-visible/dist/focus-visible';
import Footer from '@/components/organisms/Footer/Footer';

const App: AppComponent = ({ Component, pageProps }) => {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider session={pageProps.session}>
        <Box bg="gray.100" minH="100vh" display="flex" flexDir="column">
          <Header />
          <Box flexGrow={1}>
            <Component {...pageProps} />
          </Box>
          <Footer />
        </Box>
      </AuthProvider>
    </ChakraProvider>
  );
};
export default App;
