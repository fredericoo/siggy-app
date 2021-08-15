import UnauthorisedMessage from '@/components/organisms/UnauthorisedMessage';
import prisma from '@/lib/prisma';
import { Box } from '@chakra-ui/react';
import { Signature } from '@prisma/client';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';

type SignatureDetailsProps = {
  signature: Signature;
};

const SignatureDetailsRoute: React.VFC<SignatureDetailsProps> = ({
  signature,
}) => {
  if (!signature) return <UnauthorisedMessage />;
  return <Box>{signature.id}</Box>;
};

export const getServerSideProps: GetServerSideProps = async ({
  params,
  req,
}) => {
  const session = await getSession({ req });
  if (!session || !params?.signatureId) return { props: { signature: null } };

  try {
    const userCompanies = session?.id
      ? await prisma.user
          .findUnique({
            where: { id: session?.id },
            include: { companies: true },
          })
          .companies({ include: { signatures: true } })
      : [];
    const company = userCompanies.find(
      (company) => company.slug === params?.slug
    );

    if (!company) return { props: { signature: null } };

    const signature =
      company?.signatures.find(
        (signature) => signature.id === params.signatureId
      ) || null;

    return {
      props: { signature },
    };
  } catch {
    return {
      props: {
        company: null,
      },
    };
  }
};

export default SignatureDetailsRoute;
