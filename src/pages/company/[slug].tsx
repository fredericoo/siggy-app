import prisma from '@/lib/prisma';
import { Button, Container, Heading } from '@chakra-ui/react';
import { Company } from '@prisma/client';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';
import { useRouter } from 'next/dist/client/router';

type CompanyDetailsProps = {
  company: Company;
};

const CompanyDetailsRoute: React.VFC<CompanyDetailsProps> = ({ company }) => {
  const { push } = useRouter();
  const handleDelete = async () => {
    const request = await axios.post(`/api/company/delete`, {
      slug: company.slug,
    });
    if (request.status === 200) {
      push('/companies');
    }
  };
  return (
    <Container maxW="container.lg" py={8}>
      <Heading>{company.title}</Heading>
      <Button onClick={handleDelete} colorScheme="red">
        Delete company
      </Button>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  params,
  req,
}) => {
  const session = await getSession({ req });
  try {
    const userCompanies = await prisma.user
      .findUnique({ where: { id: session?.id } })
      .companies();
    const company = userCompanies.find(
      (company) => company.slug === params?.slug
    );
    return {
      props: { company },
    };
  } catch {
    return {
      props: {
        company: undefined,
      },
    };
  }
};

export default CompanyDetailsRoute;
