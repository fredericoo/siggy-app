import DeleteButton from '@/components/molecules/DeleteButton/DeleteButton';
import SignatureCard from '@/components/molecules/SignatureCard';
import UnauthorisedMessage from '@/components/organisms/UnauthorisedMessage';
import prisma from '@/lib/prisma';
import {
  Button,
  Container,
  Heading,
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import { Company } from '@prisma/client';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';
import { useRouter } from 'next/dist/client/router';
import { useState } from 'react';
import useSWR from 'swr';
import { SignaturesQueryResponse } from '../api/company/signatures';

type CompanyDetailsProps = {
  company: Company;
};

const fetcher = async (endpoint: string) => (await axios.get(endpoint)).data;

const CompanyDetailsRoute: React.VFC<CompanyDetailsProps> = ({ company }) => {
  const { push } = useRouter();
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const { data: signatures } = useSWR<SignaturesQueryResponse>(
    `/api/company/signatures?companySlug=${company?.slug}`,
    fetcher
  );

  if (!company) return <UnauthorisedMessage />;

  const handleDelete = async () => {
    setIsLoadingDelete(true);
    try {
      const request = await axios.post(`/api/company/delete`, {
        slug: company.slug,
      });
      if (request.status === 200) {
        push('/companies');
      }
    } catch (e) {
      console.log(e);
    }
    setIsLoadingDelete(false);
  };

  return (
    <Container maxW="container.lg" py={8}>
      <Heading>{company.title}</Heading>

      <Tabs pt={4} mx={{ base: -4, md: 0 }}>
        <TabList>
          <Tab>Signatures</Tab>
          <Tab>Settings</Tab>
        </TabList>
        <TabPanels>
          <TabPanel px={{ md: 0 }} py={4}>
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
              {Array.isArray(signatures) &&
                signatures?.map((signature) => (
                  <SignatureCard
                    key={signature.id}
                    signature={signature}
                    domain={company.domain || ''}
                    href={`/company/${company.slug}/${signature.id}`}
                  />
                ))}
              <Button>New signature</Button>
            </SimpleGrid>
          </TabPanel>
          <TabPanel px={{ md: 0 }} py={4}>
            <DeleteButton
              isLoading={isLoadingDelete}
              onDelete={handleDelete}
              keyword={company.slug.toUpperCase()}
            >
              Delete company
            </DeleteButton>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
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
          .companies()
      : [];
    const company =
      userCompanies.find((company) => company.slug === params?.slug) || null;

    return {
      props: { company },
    };
  } catch {
    return {
      props: {
        company: null,
      },
    };
  }
};

export default CompanyDetailsRoute;
