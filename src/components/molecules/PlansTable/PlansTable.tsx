import axios from 'axios';
import { VStack, Text, Heading, SimpleGrid } from '@chakra-ui/react';
import Spinner from '@/components/atoms/Spinner';
import Message from '@/components/molecules/Message';
import PlanCard from '@/components/molecules/PlanCard';
import { FormInputs } from '@/pages/create-company';
import { Plan } from '@/types/plan';
import { useController, useForm, useWatch } from 'react-hook-form';
import useSWR from 'swr';

// eslint-disable-next-line react-hooks/rules-of-hooks
const wrapperuseForm = () => useForm<FormInputs>();

const fetcher = async () => axios.get<Plan[]>('/api/plans');

type Props = {
  control: ReturnType<typeof wrapperuseForm>['control'];
  name: keyof FormInputs;
};

const PlansTable: React.VFC<Props> = ({ name, control }) => {
  const {
    field: { onChange },
  } = useController({
    name,
    control,
    rules: {
      required: true,
    },
    defaultValue: '',
  });

  const value = useWatch({
    control,
    name,
    defaultValue: '',
  });

  const {
    data: plans,
    error,
    revalidate,
  } = useSWR('plans', fetcher, {
    revalidateOnFocus: false,
  });

  if (error) return <Message heading="Error loading plans :(" action="Retry" onClick={() => revalidate()} />;

  if (!plans)
    return (
      <VStack minH="128px">
        <Spinner />
        <Text fontSize="sm">Loading plans</Text>
      </VStack>
    );

  return (
    <>
      <Heading size="md">Select a plan</Heading>
      <SimpleGrid columns={{ base: 1, lg: 3 }} gap="8">
        {plans?.data?.map((plan) => (
          <PlanCard
            key={plan.price.id}
            plan={plan}
            isSelected={plan.price.id === value}
            onSelect={() => onChange({ target: { value: plan.price.id } })}
          />
        ))}
      </SimpleGrid>
    </>
  );
};

export default PlansTable;
