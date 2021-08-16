import UnauthorisedMessage from '@/components/organisms/UnauthorisedMessage';
import prisma from '@/lib/prisma';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Container,
} from '@chakra-ui/react';
import { Company, Signature } from '@prisma/client';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';
import Link from 'next/link';

type SignatureDetailsProps = {
  signature: Signature & { index: number };
  company: Company;
};

const SignatureDetailsRoute: React.VFC<SignatureDetailsProps> = ({
  signature,
  company,
}) => {
  if (!signature) return <UnauthorisedMessage />;
  return (
    <Container maxW="container.lg" py={4}>
      <Breadcrumb
        separator="→"
        border="1px solid"
        py={2}
        px={4}
        borderRadius="xl"
        borderColor="gray.200"
      >
        <BreadcrumbItem>
          <Link href={`/companies`} passHref>
            <BreadcrumbLink>Companies</BreadcrumbLink>
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Link href={`/company/${company.slug}`} passHref>
            <BreadcrumbLink>{company.title}</BreadcrumbLink>
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <Link href={`/company/${company.slug}/${signature.id}`} passHref>
            <BreadcrumbLink>Signature #{signature.index + 1}</BreadcrumbLink>
          </Link>
        </BreadcrumbItem>
      </Breadcrumb>
    </Container>
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
              signatures: { select: { template: true, id: true } },
            },
          })
      : [];
    const company = userCompanies.find(
      (company) => company.slug === params?.slug
    );

    if (!company) return { props: { signature: null, company: null } };

    const signatureIndex = company?.signatures.findIndex(
      (signature) => signature.id === params.signatureId
    );

    const signature =
      company?.signatures.find(
        (signature) => signature.id === params.signatureId
      ) || null;

    return {
      props: { signature: { ...signature, index: signatureIndex }, company },
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
