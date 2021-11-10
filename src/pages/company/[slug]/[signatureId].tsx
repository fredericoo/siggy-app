import DynamicContent from '@/components/molecules/DynamicContent/DynamicContent';
import SignaturePreview from '@/components/molecules/SignaturePreview/SignaturePreview';
import PageHeader from '@/components/organisms/PageHeader';
import ExportSignatureMenu from '@/components/molecules/ExportSignatureMenu';
import SignatureSettings from '@/components/molecules/SignatureSettings';
import UnauthorisedMessage from '@/components/organisms/UnauthorisedMessage';
import prisma from '@/lib/prisma';
import { TemplateParametersResponse } from '@/pages/api/template/[templateId]/parameters';
import {
  VStack,
  Container,
  SimpleGrid,
  Tab,
  Tabs,
  TabPanels,
  TabPanel,
  TabList,
  Button,
  HStack,
} from '@chakra-ui/react';
import { Signature, Template, Company } from '@prisma/client';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';
import { useMemo } from 'react';
import useSWR from 'swr';
import { FormProvider, useForm } from 'react-hook-form';
import ParameterInput from '@/components/molecules/ParameterInput';
import ActionSheet from '@/components/molecules/ActionSheet';

type SignatureDetailsProps = {
  signature: Signature & { template: Template } & { company: Company };
  isAdmin?: boolean;
};

const fetcher = async (endpoint: string) => (await axios.get(endpoint)).data;

const SignatureDetailsRoute: React.VFC<SignatureDetailsProps> = ({ signature, isAdmin }) => {
  const { data: parameters, error } = useSWR<TemplateParametersResponse>(
    `/api/template/${signature?.template?.id}/parameters`,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );
  const { data: settings, mutate } = useSWR(`/api/signature/${signature?.id}/settings`, fetcher);
  const form = useForm();

  const memberParameters = useMemo(() => parameters?.filter((param) => !param.isCompanyParameter), [parameters]);
  const companyParameters = useMemo(() => parameters?.filter((param) => param.isCompanyParameter), [parameters]);
  const savedCompanyParameters = useMemo(() => JSON.parse(settings?.companyParametersJson || '{}'), [settings]);

  const isCompanyParametersDirty = !!Object.keys(form.formState.dirtyFields).find((field) =>
    companyParameters?.find((parameter) => parameter.handlebar === field)
  );

  if (!signature) return <UnauthorisedMessage />;

  const handleSave = async (formData: Record<string, string>) => {
    const companyFormData = Object.fromEntries(
      companyParameters?.map((parameter) => [parameter.handlebar, formData[parameter.handlebar]]) || []
    );
    const companyParametersJson = JSON.stringify(companyFormData);

    await axios.put(`/api/signature/${signature.id}/settings`, {
      companyParametersJson,
    });
    form.reset(formData);
    mutate();
  };

  return (
    <>
      <PageHeader
        title={signature.title}
        breadcrumbs={
          isAdmin && [
            { label: 'Companies', href: '/companies' },
            {
              label: signature?.company?.title,
              href: `/company/${signature?.company?.slug}`,
            },
          ]
        }
      />
      <Container maxW="container.xl" py={4}>
        <FormProvider {...form}>
          <SimpleGrid columns={{ xl: 2 }} gap={8} alignItems="start">
            <VStack>
              <SignaturePreview
                companyParameters={savedCompanyParameters}
                watchFields={memberParameters?.map((parameter) => parameter.handlebar)}
                control={form.control}
                isLoading={!settings}
                html={signature.template.html}
              />
            </VStack>
            <Tabs as="form" onSubmit={form.handleSubmit(handleSave)}>
              {isAdmin && (
                <TabList>
                  <Tab>Member</Tab>
                  {!!companyParameters?.length && <Tab>Company</Tab>}
                  {<Tab>Settings</Tab>}
                </TabList>
              )}
              <TabPanels>
                <TabPanel px={0}>
                  <ActionSheet
                    footer={
                      <ExportSignatureMenu control={form.control} html={signature.template.html}>
                        Use this signature
                      </ExportSignatureMenu>
                    }
                  >
                    <DynamicContent isError={error} isLoading={!parameters && !error}>
                      <VStack spacing={4}>
                        {memberParameters?.map((parameter) => (
                          <ParameterInput
                            key={parameter.handlebar}
                            name={parameter.handlebar}
                            type={parameter?.type?.title}
                            isRequired={false}
                            label={parameter.title}
                          />
                        ))}
                      </VStack>
                    </DynamicContent>
                  </ActionSheet>
                </TabPanel>
                {isAdmin && !!companyParameters?.length && (
                  <TabPanel px={0}>
                    <DynamicContent isError={error} isLoading={!parameters && !error}>
                      {settings && (
                        <ActionSheet
                          footer={
                            isCompanyParametersDirty && (
                              <HStack justify="center">
                                <Button type="submit" variant="primary" isLoading={form.formState.isSubmitting}>
                                  Save changes
                                </Button>
                              </HStack>
                            )
                          }
                        >
                          <VStack spacing={4}>
                            {companyParameters.map((parameter) => (
                              <ParameterInput
                                name={parameter.handlebar}
                                label={parameter.title}
                                key={parameter.handlebar}
                                type={parameter?.type?.title}
                                isRequired={parameter.isRequired}
                                isDisabled={form.formState.isSubmitting}
                                defaultValue={savedCompanyParameters[parameter.handlebar]}
                                highlightDirty
                              />
                            ))}
                          </VStack>
                        </ActionSheet>
                      )}
                    </DynamicContent>
                  </TabPanel>
                )}
                {isAdmin && (
                  <TabPanel px={0}>
                    <SignatureSettings signatureId={signature.id} companySlug={signature.company.slug} />
                  </TabPanel>
                )}
              </TabPanels>
            </Tabs>
          </SimpleGrid>
        </FormProvider>
      </Container>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params, req }) => {
  if (typeof params?.signatureId !== 'string' || typeof params?.slug !== 'string')
    return { props: { signature: null } };
  try {
    const signature = await prisma.signature.findFirst({
      where: { id: params.signatureId, companySlug: params.slug },
      select: {
        title: true,
        template: true,
        id: true,
        isPublic: true,
        company: {
          select: {
            domain: true,
            slug: true,
            title: true,
          },
        },
      },
    });

    const session = await getSession({ req });

    const userMatchingCompanies = session?.id
      ? await prisma.user
          .findUnique({
            where: { id: session?.id },
          })
          .companies({
            where: { slug: params.slug },
          })
      : [];

    if (!userMatchingCompanies.length && signature?.isPublic !== true) return { props: { signature: null } };

    return {
      props: { signature, isAdmin: !!userMatchingCompanies.length },
    };
  } catch {
    return {
      props: {
        signature: null,
      },
    };
  }
};

export default SignatureDetailsRoute;
