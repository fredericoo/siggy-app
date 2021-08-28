import TemplateCard from '@/components/molecules/TemplateCard';
import prisma from '@/lib/prisma';
import {
  Heading,
  VStack,
  SimpleGrid,
  HStack,
  Button,
  Text,
  Input,
  FormControl,
  FormLabel,
  useRadioGroup,
  useToast,
} from '@chakra-ui/react';
import FormErrorHelper from '@/components/molecules/FormErrorHelper/FormErrorHelper';
import Link from 'next/link';
import { Company, Template } from '@prisma/client';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import PageHeader from '@/components/organisms/PageHeader';
import ActionSheet from '@/components/molecules/ActionSheet/ActionSheet';
import axios from 'axios';
import { useRouter } from 'next/dist/client/router';

type CreateSignatureRouteProps = {
  company: Company;
  templates: Template[];
};

type FormInputs = {
  title: string;
  templateId: number;
};

const CreateSignatureRoute: React.VFC<CreateSignatureRouteProps> = ({
  company,
  templates,
}) => {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();
  const [isLoading, setIsLoading] = useState(false);
  const { push } = useRouter();
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'templateId',
    defaultValue: 0,
    onChange: (value) => setValue('templateId', +value),
  });
  const group = getRootProps();
  const toast = useToast();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/signature/create', {
        ...data,
        companySlug: company.slug,
      });
      if (!response.data.error) {
        push(`/company/${company.slug}/${response.data.id}`);
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
        title="New Signature"
        breadcrumbs={[
          { label: 'Companies', href: '/companies' },
          { label: company.title, href: `/company/${company.slug}` },
        ]}
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

            <Link href={`/company/${company.slug}`} passHref>
              <Button size="sm" variant="link" as="a">
                Cancel
              </Button>
            </Link>
          </HStack>
        }
      >
        <FormControl
          id="name"
          isRequired
          isDisabled={isLoading}
          isInvalid={!!errors.title}
        >
          <FormLabel>Give it a name</FormLabel>
          <Input
            type="text"
            {...register('title', {
              required: true,
              value: `${company.title}’s brand new signature`,
            })}
          />
          <FormErrorHelper error={errors.title} />
        </FormControl>

        <VStack align="initial" spacing={8} mt={8}>
          <Heading as="h2" size="lg">
            Select a template
          </Heading>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} {...group}>
            {templates.map((template) => {
              const radio = getRadioProps({ value: template.id.toString() });
              return (
                <TemplateCard
                  key={template.id}
                  template={template}
                  domain={company.domain || 'siggy.io'}
                  {...radio}
                />
              );
            })}
          </SimpleGrid>
        </VStack>
      </ActionSheet>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  params,
  req,
}) => {
  const session = await getSession({ req });
  if (!session || !params?.slug) return { props: { signature: null } };

  try {
    const userCompanies = session?.id
      ? await prisma.user
          .findUnique({
            where: { id: session?.id },
            select: { companies: true },
          })
          .companies({
            select: { title: true, slug: true, planId: true, domain: true },
          })
      : [];
    const company =
      userCompanies.find((company) => company.slug === params?.slug) || null;

    const templates = await prisma.template.findMany({
      where: {
        planId: company?.planId || 0,
      },
    });

    return {
      props: { company, templates },
    };
  } catch {
    return {
      props: {
        company: null,
        templates: [],
      },
    };
  }
};

export default CreateSignatureRoute;
