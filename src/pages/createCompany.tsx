import Spinner from '@/components/atoms/Spinner';
import Message from '@/components/molecules/Message';
import PlanCard, {
  PlanCardProps,
} from '@/components/molecules/PlanCard/PlanCard';
import useUserSession from '@/lib/useUserSession';
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
  Center,
  useToast,
} from '@chakra-ui/react';
import { Plan } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/dist/client/router';
import Link from 'next/link';
import { useState } from 'react';
import slugify from 'slugify';
import useSWR from 'swr';

const fetcher = async () => axios.get<Plan[]>('/api/plans');

const CreateCompanyRoute: React.VFC = () => {
  useUserSession();
  const { push } = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();
  const [title, setTitle] = useState('');
  const [domain, setDomain] = useState('');
  const [planId, setPlanId] = useState<number | undefined>(undefined);
  const slug = slugify(title, {
    lower: true,
    strict: true,
  });

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post('/api/company/create', {
        title,
        domain,
        slug,
        planId,
      });
      if (!response.data.error) {
        push(`/company/${response.data.slug}`);
      } else {
        toast({
          title: 'Oops',
          description: response.data.error,
          status: 'error',
          duration: 3000,
        });
        setIsLoading(false);
      }
    } catch (error) {
      toast({
        title: 'Oops',
        description: 'An unexpected rror occurred.',
        status: 'error',
        duration: 3000,
      });
      setIsLoading(false);
    }
  };

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
          <FormHelperText>{`https://siggy.io/company/${slug}`}</FormHelperText>
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

        <Plans onSelect={setPlanId} selectedId={planId} />
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

          <Link href="/companies" passHref>
            <Button size="sm" variant="link" as="a">
              Cancel
            </Button>
          </Link>
        </HStack>
      </VStack>
    </Container>
  );
};

type PlansProps = {
  onSelect: PlanCardProps['onSelect'];
  selectedId?: number;
};

const Plans: React.VFC<PlansProps> = ({ onSelect, selectedId }) => {
  const {
    data: plans,
    error,
    revalidate,
  } = useSWR('plans', fetcher, {
    revalidateOnFocus: false,
  });

  if (error)
    return (
      <Message
        heading="Error loading plans :("
        action="Retry"
        onClick={() => revalidate()}
      />
    );

  if (!plans)
    return (
      <Center h="128px">
        <Spinner />
        <Text fontSize="sm">Loading plans</Text>
      </Center>
    );

  return (
    <>
      <Heading size="md">Select a plan</Heading>
      <SimpleGrid columns={{ base: 1, lg: 3 }} gap="8">
        {plans?.data?.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isSelected={plan.id === selectedId}
            onSelect={onSelect}
          />
        ))}
      </SimpleGrid>
    </>
  );
};

export default CreateCompanyRoute;
