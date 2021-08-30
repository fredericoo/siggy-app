import DeleteButton from '@/components/molecules/DeleteButton/DeleteButton';
import SignatureCard from '@/components/molecules/SignatureCard';
import PageHeader from '@/components/organisms/PageHeader';
import UnauthorisedMessage from '@/components/organisms/UnauthorisedMessage';
import prisma from '@/lib/prisma';
import {
  Button,
  Container,
  Heading,
  SimpleGrid,
  Text,
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
import Link from 'next/link';
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
    <>
      <PageHeader
        title={company.title}
        breadcrumbs={[{ label: 'Companies', href: '/companies' }]}
      />

      <Container maxW="container.lg">
        <Tabs variant="custom" pt={4}>
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
                <Link
                  href={`/company/${company.slug}/create-signature`}
                  passHref
                >
                  <Button variant="primary" as="a">
                    New signature
                  </Button>
                </Link>
              </SimpleGrid>
            </TabPanel>

            <TabPanel px={{ md: 0 }} py={4}>
              <Heading as="h3" size="md" mb={4}>
                Change information
              </Heading>
              <Text>No fields available yet. Keep an eye out ;)</Text>

              <Heading as="h3" size="md" my={4}>
                Danger zone
              </Heading>
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
