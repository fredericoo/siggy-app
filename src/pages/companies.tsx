import type { Company } from '@prisma/client';
import { useSession } from 'next-auth/client';
import { Container, Heading, Skeleton } from '@chakra-ui/react';
import CompaniesList from '@/components/organisms/CompaniesList';
import useSWR from 'swr';
import axios from 'axios';

const fetcher = async () => {
  const companies = await axios.get<Company[]>('/api/companies');
  return companies.data;
};

const CompaniesRoute: React.VFC = () => {
  const [session, isLoadingUser] = useSession();
  const key = session?.id ? `companies/${session.id}` : 'unauthorized';
  const { data: companies } = useSWR(key, fetcher);
  const isLoadingCompanies = typeof companies === 'undefined';

  return (
    <Container maxW="container.lg" py={8}>
      <Heading mb={8}>
        Mrow,{' '}
        {isLoadingUser ? (
          <Skeleton display="inline-block" w="100px" h=".7em" />
        ) : (
          session?.user?.name
        )}
      </Heading>
      <CompaniesList companies={companies} isLoading={isLoadingCompanies} />
    </Container>
  );
};

export default CompaniesRoute;
