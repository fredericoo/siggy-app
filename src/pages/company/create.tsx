import Message from '@/components/molecules/Message'
import PlanCard from '@/components/molecules/PlanCard/PlanCard'
import {
  Text,
  Button,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftAddon,
  SimpleGrid,
  VStack,
} from '@chakra-ui/react'
import { Plan } from '@prisma/client'
import axios from 'axios'
import { useRouter } from 'next/dist/client/router'
import { useState } from 'react'
import useSWR from 'swr'

const fetcher = async () => axios.get<Plan[]>('/api/plans')

const CreateCompanyRoute: React.VFC = () => {
  const { data: plans, error, revalidate } = useSWR('plans', fetcher)
  const { back, push } = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const [title, setTitle] = useState('')
  const [domain, setDomain] = useState('')
  const [planId, setPlanId] = useState<number | undefined>(undefined)

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    setIsLoading(true)
    try {
      const result = await axios.post('/api/company/create', {
        title,
        domain,
        planId,
      })
      const createdId = result.data.id
      push(`/company/${createdId}`)
    } catch (error) {
      setIsLoading(false)
    }
  }

  return (
    <Container maxW="container.md" py={8}>
      <VStack as="form" spacing={8} onSubmit={handleSubmit}>
        <FormControl id="name" isRequired isDisabled={isLoading}>
          <FormLabel>Company Name</FormLabel>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormControl>

        <FormControl id="domain" isRequired isDisabled={isLoading}>
          <FormLabel>Email domain</FormLabel>
          <InputGroup>
            <InputLeftAddon>employee@</InputLeftAddon>
            <Input
              type="text"
              placeholder="yourdomain.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
            />
          </InputGroup>
          <FormHelperText>
            You will not be able to change this in the future!
          </FormHelperText>
        </FormControl>

        {error ? (
          <Message
            heading="Error loading plans :("
            action="Retry"
            onClick={() => revalidate()}
          />
        ) : (
          <>
            <Heading size="md">Select a plan</Heading>
            <SimpleGrid columns={3} gap="8">
              {plans?.data?.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  isSelected={plan.id === planId}
                  onSelect={setPlanId}
                />
              ))}
            </SimpleGrid>
          </>
        )}
        <HStack>
          <Button
            type="submit"
            size="lg"
            variant="solid"
            colorScheme="orange"
            isLoading={isLoading}
          >
            Create
          </Button>
          <Text>or</Text>

          <Button size="sm" variant="link" onClick={() => back()}>
            Cancel
          </Button>
        </HStack>
      </VStack>
    </Container>
  )
}

export default CreateCompanyRoute
