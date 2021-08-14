import SignatureCard from '@/components/molecules/SignatureCard';
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
import useSWR from 'swr';
import { SignaturesQueryResponse } from '../api/company/signatures';

type CompanyDetailsProps = {
  company: Company;
};

const fetcher = async (endpoint: string) => (await axios.get(endpoint)).data;

const CompanyDetailsRoute: React.VFC<CompanyDetailsProps> = ({ company }) => {
  const { push } = useRouter();

  const { data: signatures } = useSWR<SignaturesQueryResponse>(
    `/api/company/signatures?company_id=${company.id}`,
    fetcher
  );

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

      <Tabs pt={4}>
        <TabList>
          <Tab>Templates</Tab>
          <Tab>Settings</Tab>
        </TabList>
        <TabPanels>
          <TabPanel px={0} py={4}>
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
              {Array.isArray(signatures) &&
                signatures?.map((signature) => (
                  <SignatureCard key={signature.id} signature={signature} />
                ))}
              <Button h="100%">New signature</Button>
            </SimpleGrid>
          </TabPanel>
          <TabPanel px={0} py={4}>
            <Button onClick={handleDelete} colorScheme="red">
              Delete company
            </Button>
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
  try {
    const userCompanies = session?.id
      ? await prisma.user.findUnique({ where: { id: session?.id } }).companies()
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

export default CompanyDetailsRoute;
