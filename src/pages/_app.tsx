import { Box, ChakraProvider } from '@chakra-ui/react';
import { AppComponent } from 'next/dist/next-server/lib/router/router';
import { theme } from '@/styles/theme';
import Header from '@/components/organisms/Header';
import { Provider as AuthProvider } from 'next-auth/client';
import 'focus-visible/dist/focus-visible';
import Footer from '@/components/organisms/Footer/Footer';
import { useRouter } from 'next/dist/client/router';
import { useEffect, useState } from 'react';

const App: AppComponent = ({ Component, pageProps }) => {
  const { events } = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => {
      setIsLoading(true);
    };
    const handleStop = () => {
      setIsLoading(false);
    };
    events.on('routeChangeStart', handleStart);
    events.on('routeChangeComplete', handleStop);
    events.on('routeChangeError', handleStop);

    return () => {
      events.off('routeChangeStart', handleStart);
      events.off('routeChangeComplete', handleStop);
      events.off('routeChangeError', handleStop);
    };
  }, [events]);

  return (
    <ChakraProvider theme={theme}>
      <AuthProvider session={pageProps.session}>
        <Box bg="gray.100" minH="100vh" display="flex" flexDir="column">
          <Header />
          <Box
            flexGrow={1}
            opacity={isLoading ? 0 : 1}
            transition="opacity .6s cubic-bezier(0.16, 1, 0.3, 1)"
          >
            <Component {...pageProps} />
          </Box>
          <Footer />
        </Box>
      </AuthProvider>
    </ChakraProvider>
  );
};
export default App;
