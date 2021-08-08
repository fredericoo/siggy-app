import { VStack, Text } from '@chakra-ui/react'
import { useSession } from 'next-auth/client'
import { useRouter } from 'next/dist/client/router'
import { useEffect } from 'react'
import Spinner from '@/components/atoms/Spinner'

const Home: React.FC = () => {
  const { push } = useRouter()
  const [session, loading] = useSession()

  useEffect(() => {
    if (!loading) {
      if (session) {
        push('/companies')
      } else {
        push('/api/auth/signin')
      }
    }
  }, [loading, session, push])

  return (
    <VStack py={8}>
      <Spinner />
      <Text>Filling up Siggy’s food bowl…</Text>
    </VStack>
  )
}

export default Home
