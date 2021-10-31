import ActionSheet from '@/components/molecules/ActionSheet/ActionSheet';
import FormErrorHelper from '@/components/molecules/FormErrorHelper/FormErrorHelper';
import PageHeader from '@/components/organisms/PageHeader';
import useUserSession from '@/lib/useUserSession';
import {
  Text,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputLeftAddon,
  VStack,
  useToast,
  Box,
} from '@chakra-ui/react';
import axios from 'axios';
import { useRouter } from 'next/dist/client/router';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toSlug } from '@/lib/slug';
import SlugInput from '@/components/atoms/SlugInput';
import PlansTable from '@/components/molecules/PlansTable';

export type FormInputs = {
  title: string;
  slug: string;
  domain: string;
  priceId: string;
};

const CreateCompanyRoute: React.VFC = () => {
  useUserSession();
  const { push } = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormInputs>();
  const [title] = watch(['title']);

  useEffect(() => {
    setValue('slug', toSlug(title));
  }, [setValue, title]);

  const toast = useToast();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/company/create', data);
      if (!response.data.error) {
        push(response.data.redirectURL);
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
        description: 'An unexpected error occurred.',
        status: 'error',
        duration: 3000,
      });
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageHeader title="New Company" breadcrumbs={[{ label: 'Companies', href: '/companies' }]} />
      <ActionSheet
        as="form"
        onSubmit={handleSubmit<FormInputs>(onSubmit)}
        footer={
          <HStack justify="center">
            <Button type="submit" size="lg" variant="primary" isLoading={isLoading}>
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
            <FormControl id="name" isRequired isDisabled={isLoading} isInvalid={!!errors.title}>
              <FormLabel>Company Name</FormLabel>
              <Input autoComplete="off" type="text" {...register('title', { required: true })} />
              <FormErrorHelper error={errors.title} />
            </FormControl>

            <SlugInput name="slug" control={control} />
          </Box>

          <FormControl id="domain" isRequired isDisabled={isLoading}>
            <FormLabel>Email domain</FormLabel>
            <InputGroup>
              <InputLeftAddon>employee@</InputLeftAddon>
              <Input autoComplete="off" type="text" placeholder="yourdomain.com" {...register('domain')} />
            </InputGroup>
          </FormControl>

          <PlansTable name="priceId" control={control} />
        </VStack>
      </ActionSheet>
    </>
  );
};

export default CreateCompanyRoute;
