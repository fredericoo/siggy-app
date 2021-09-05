import Spinner from '@/components/atoms/Spinner';
import ActionSheet from '@/components/molecules/ActionSheet/ActionSheet';
import FormErrorHelper from '@/components/molecules/FormErrorHelper/FormErrorHelper';
import Message from '@/components/molecules/Message';
import PlanCard, {
  PlanCardProps,
} from '@/components/molecules/PlanCard/PlanCard';
import PageHeader from '@/components/organisms/PageHeader';
import useUserSession from '@/lib/useUserSession';
import { Plan } from '@/types/plan';
import {
  Text,
  Button,
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
  useToast,
  Box,
} from '@chakra-ui/react';
import axios from 'axios';
import { useRouter } from 'next/dist/client/router';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm, UseFormRegister } from 'react-hook-form';
import slugify from 'slugify';
import useSWR from 'swr';

const fetcher = async () => axios.get<Plan[]>('/api/plans');

type FormInputs = {
  title: string;
  slug: string;
  domain: string;
  priceId: string;
};

const toSlug = (str: string) =>
  slugify(str || '', { lower: true, strict: true });

const CreateCompanyRoute: React.VFC = () => {
  useUserSession();
  const { push } = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormInputs>();
  const [priceId, title] = watch(['priceId', 'title']);

  useEffect(() => {
    setValue('slug', toSlug(title));
  }, [setValue, title]);

  const toast = useToast();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/company/create', data);
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
    <>
      <PageHeader
        title="New Company"
        breadcrumbs={[{ label: 'Companies', href: '/companies' }]}
      />
      <ActionSheet
        as="form"
        onSubmit={handleSubmit<FormInputs>(onSubmit)}
        footer={
          <HStack justify="center">
            <Button
              type="submit"
              size="lg"
              variant="primary"
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
        }
      >
        <VStack spacing={8}>
          <Box w="100%">
            <FormControl
              id="name"
              isRequired
              isDisabled={isLoading}
              isInvalid={!!errors.title}
            >
              <FormLabel>Company Name</FormLabel>
              <Input type="text" {...register('title', { required: true })} />
              <FormErrorHelper error={errors.title} />
            </FormControl>
            <FormControl id="slug" isInvalid={!!errors.slug}>
              <FormHelperText>
                <Box display="flex">
                  <Text
                    flexGrow={1}
                    whiteSpace="nowrap"
                  >{`https://siggy.io/company/`}</Text>
                  <Input
                    borderRadius="none"
                    bg={errors.slug ? 'red.100' : 'inherit'}
                    fontSize="inherit"
                    display="inline-block"
                    variant="unstyled"
                    type="text"
                    _focus={{ bg: 'gray.100' }}
                    {...register('slug', {
                      required: true,
                      validate: (str) => str === toSlug(str),
                    })}
                  />
                </Box>
                <FormErrorHelper error={errors.slug} />
              </FormHelperText>
            </FormControl>
          </Box>

          <FormControl id="domain" isRequired isDisabled={isLoading}>
            <FormLabel>Email domain</FormLabel>
            <InputGroup>
              <InputLeftAddon>employee@</InputLeftAddon>
              <Input
                type="text"
                placeholder="yourdomain.com"
                {...register('domain')}
              />
            </InputGroup>
            <FormHelperText>
              You will not be able to change this in the future!
            </FormHelperText>
          </FormControl>

          <Plans
            onSelect={(priceId: string) => setValue('priceId', priceId)}
            selectedId={priceId}
            register={register}
          />
        </VStack>
      </ActionSheet>
    </>
  );
};

type PlansProps = {
  onSelect: PlanCardProps['onSelect'];
  selectedId?: string;
  register: UseFormRegister<FormInputs>;
};

const Plans: React.VFC<PlansProps> = ({ onSelect, selectedId, register }) => {
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
            {...register}
            key={plan.price.id}
            plan={plan}
            isSelected={plan.price.id === selectedId}
            onSelect={onSelect}
          />
        ))}
      </SimpleGrid>
    </>
  );
};

export default CreateCompanyRoute;
