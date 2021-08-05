import { ChakraProvider } from '@chakra-ui/react'
import { AppComponent } from 'next/dist/next-server/lib/router/router'
import { theme } from '@/styles/theme'

const App: AppComponent = ({ Component, pageProps }) => {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}
export default App
