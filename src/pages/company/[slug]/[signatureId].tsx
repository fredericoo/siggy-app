import DynamicContent from '@/components/molecules/DynamicContent/DynamicContent';
import ParametersForm from '@/components/molecules/ParametersForm/ParametersForm';
import SignaturePreview from '@/components/molecules/SignaturePreview/SignaturePreview';
import PageHeader from '@/components/organisms/PageHeader';
import SignatureSettings from '@/components/molecules/SignatureSettings';
import UnauthorisedMessage from '@/components/organisms/UnauthorisedMessage';
import { parseHandlebars } from '@/lib/handlebars';
import { generateMockParameters } from '@/lib/mockParameters';
import prisma from '@/lib/prisma';
import { TemplateParametersResponse } from '@/pages/api/template/[templateId]/parameters';
import {
  Container,
  SimpleGrid,
  Tab,
  Tabs,
  TabPanels,
  TabPanel,
  TabList,
} from '@chakra-ui/react';
import { Signature, Template, Company } from '@prisma/client';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';
import { useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';

type SignatureDetailsProps = {
  signature: Signature & { template: Template } & { company: Company };
  isAdmin?: boolean;
};

const fetcher = async (endpoint: string) => (await axios.get(endpoint)).data;

const SignatureDetailsRoute: React.VFC<SignatureDetailsProps> = ({
  signature,
  isAdmin,
}) => {
  const { data: parameters, error } = useSWR<TemplateParametersResponse>(
    `/api/template/${signature?.template?.id}/parameters`,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );
  const { data: settings } = useSWR(
    `/api/signature/${signature?.id}/settings`,
    fetcher
  );
  const [previewParameters, setPreviewParameters] = useState<
    Record<string, string>
  >({});

  const mockParameters = useMemo(
    () => generateMockParameters(signature?.company?.domain || 'siggy.app'),
    [signature]
  );

  const hasParameters = Object.values(previewParameters).reduce((acc, cur) => {
    if (typeof cur === 'string' && cur.length > 0) return acc + 1;
    return acc;
  }, 0);

  const memberParameters = useMemo(
    () => parameters?.filter((param) => !param.isCompanyParameter),
    [parameters]
  );
  const companyParameters = useMemo(
    () => parameters?.filter((param) => param.isCompanyParameter),
    [parameters]
  );

  useEffect(() => {
    if (settings) {
      const newSettingsJson = JSON.parse(settings?.companyParametersJson) || {};
      const newCompanyParams =
        companyParameters?.reduce(
          (acc, cur) => ({ ...acc, [cur.handlebar]: '' }),
          {}
        ) || {};
      const params = {
        ...previewParameters,
        ...newCompanyParams,
        ...newSettingsJson,
      };
      setPreviewParameters(params);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyParameters, setPreviewParameters, settings]);

  if (!signature) return <UnauthorisedMessage />;

  const handlePreview = (formData: Record<string, string>) => {
    const newMemberParams =
      memberParameters?.reduce(
        (acc, cur) => ({ ...acc, [cur.handlebar]: '' }),
        {}
      ) || {};
    const params = { ...previewParameters, ...newMemberParams, ...formData };
    setPreviewParameters(params);
  };

  const handleSave = async (formData: Record<string, string>) => {
    const newCompanyParams =
      companyParameters?.reduce(
        (acc, cur) => ({ ...acc, [cur.handlebar]: '' }),
        {}
      ) || {};
    const params = { ...previewParameters, ...newCompanyParams, ...formData };
    await axios.put(`/api/signature/${signature.id}/settings`, {
      companyParametersJson: JSON.stringify({
        ...newCompanyParams,
        ...formData,
      }),
    });
    setPreviewParameters(params);
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
        <SimpleGrid minChildWidth="400px" gap={8} alignItems="start">
          <SignaturePreview
            html={parseHandlebars(
              signature.template.html,
              hasParameters ? previewParameters : mockParameters
            )}
          />
          <Tabs>
            {isAdmin && (
              <TabList>
                <Tab>Member</Tab>
                {!!companyParameters?.length && <Tab>Company</Tab>}
                {<Tab>Settings</Tab>}
              </TabList>
            )}
            <TabPanels>
              <TabPanel px={0}>
                <DynamicContent
                  isError={error}
                  isLoading={!parameters && !error}
                >
                  <ParametersForm
                    parameters={memberParameters}
                    values={previewParameters}
                    onAction={handlePreview}
                    actionLabel="Preview"
                  />
                </DynamicContent>
              </TabPanel>
              {isAdmin && !!companyParameters?.length && (
                <TabPanel px={0}>
                  <DynamicContent
                    isError={error}
                    isLoading={!parameters && !error}
                  >
                    {settings && (
                      <ParametersForm
                        parameters={companyParameters}
                        values={JSON.parse(settings.companyParametersJson)}
                        onAction={handleSave}
                        actionLabel="Save"
                      />
                    )}
                  </DynamicContent>
                </TabPanel>
              )}
              {isAdmin && (
                <TabPanel px={0}>
                  <SignatureSettings
                    signatureId={signature.id}
                    companySlug={signature.company.slug}
                  />
                </TabPanel>
              )}
            </TabPanels>
          </Tabs>
        </SimpleGrid>
      </Container>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  params,
  req,
}) => {
  if (
    typeof params?.signatureId !== 'string' ||
    typeof params?.slug !== 'string'
  )
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

    if (!userMatchingCompanies.length && signature?.isPublic !== true)
      return { props: { signature: null } };

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
