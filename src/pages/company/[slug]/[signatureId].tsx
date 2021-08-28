import PageHeader from '@/components/organisms/PageHeader';
import UnauthorisedMessage from '@/components/organisms/UnauthorisedMessage';
import { parseHandlebars } from '@/lib/handlebars';
import { generateMockParameters } from '@/lib/mockParameters';
import prisma from '@/lib/prisma';
import { Box, Container } from '@chakra-ui/react';
import { Company, Signature, Template } from '@prisma/client';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';

type SignatureDetailsProps = {
  signature: Signature & { template: Template };
  company: Company;
};

const SignatureDetailsRoute: React.VFC<SignatureDetailsProps> = ({
  signature,
  company,
}) => {
  if (!signature) return <UnauthorisedMessage />;

  const html = parseHandlebars(
    signature.template.html,
    generateMockParameters(company.domain || 'siggy.io')
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
      <Container maxW="container.lg" py={4}>
        <Box
          minW="600px"
          dangerouslySetInnerHTML={{
            __html: html,
          }}
        />
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
