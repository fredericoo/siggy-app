import prisma from '@/lib/prisma';
import { Box } from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';

const CreateSignature: React.VFC = () => {
  return <Box></Box>;
};

export const getServerSideProps: GetServerSideProps = async ({
  params,
  req,
}) => {
  const session = await getSession({ req });
  try {
    const userCompanies = session?.id
      ? await prisma.user
          .findUnique({
            where: { id: session?.id },
            include: { companies: true },
          })
          .companies()
      : [];
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

export default CreateSignature;
