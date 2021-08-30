import ParametersForm from '@/components/molecules/ParametersForm/ParametersForm';
import SignaturePreview from '@/components/molecules/SignaturePreview/SignaturePreview';
import PageHeader from '@/components/organisms/PageHeader';
import UnauthorisedMessage from '@/components/organisms/UnauthorisedMessage';
import { parseHandlebars } from '@/lib/handlebars';
import { generateMockParameters } from '@/lib/mockParameters';
import prisma from '@/lib/prisma';
import { TemplateParametersResponse } from '@/pages/api/template/[templateId]/parameters';
import { Container, SimpleGrid } from '@chakra-ui/react';
import { Company, Signature, Template } from '@prisma/client';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';
import { useState } from 'react';
import useSWR from 'swr';

type SignatureDetailsProps = {
  signature: Signature & { template: Template };
  company: Company;
};

const fetcher = async (endpoint: string) => (await axios.get(endpoint)).data;

const SignatureDetailsRoute: React.VFC<SignatureDetailsProps> = ({
  signature,
  company,
}) => {
  const { data: parameters, error } = useSWR<TemplateParametersResponse>(
    `/api/template/${signature.template.id}/parameters`,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );
  const [previewParameters, setPreviewParameters] = useState<
    Record<string, string>
  >({});
  if (!signature) return <UnauthorisedMessage />;

  const html = parseHandlebars(
    signature.template.html,
    previewParameters || generateMockParameters(company.domain || 'siggy.io')
  );

  return (
    <>
      <PageHeader
        title={signature.title}
        breadcrumbs={[
          { label: 'Companies', href: '/companies' },
          { label: company.title, href: `/company/${company.slug}` },
        ]}
      />
      <Container maxW="container.xl" py={4}>
        <SimpleGrid minChildWidth="400px" gap={8}>
          <SignaturePreview html={html} />
          <ParametersForm
            parameters={parameters}
            isLoading={!parameters && !error}
            onPreview={setPreviewParameters}
          />
        </SimpleGrid>
      </Container>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  params,
  req,
}) => {
  const session = await getSession({ req });
  if (!session || !params?.signatureId)
    return { props: { signature: null, company: null } };
  try {
    const userCompanies = session?.id
      ? await prisma.user
          .findUnique({
            where: { id: session?.id },
            select: { companies: true },
          })
          .companies({
            select: {
              slug: true,
              title: true,
              signatures: { select: { title: true, template: true, id: true } },
            },
          })
      : [];
    const company = userCompanies.find(
      (company) => company.slug === params?.slug
    );

    if (!company) return { props: { signature: null, company: null } };

    const signature =
      company?.signatures.find(
        (signature) => signature.id === params.signatureId
      ) || null;

    return {
      props: { signature, company },
    };
  } catch {
    return {
      props: {
        signature: null,
        company: null,
      },
    };
  }
};

export default SignatureDetailsRoute;
