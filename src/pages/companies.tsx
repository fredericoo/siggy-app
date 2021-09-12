import type { Company } from '@prisma/client';
import { Container, Skeleton, Button } from '@chakra-ui/react';
import CompaniesList from '@/components/organisms/CompaniesList';
import useSWR from 'swr';
import axios from 'axios';
import useUserSession from '@/lib/useUserSession';
import PageHeader from '@/components/organisms/PageHeader';
import Link from 'next/link';

const fetcher = async () => {
  const companies = await axios.get<Company[]>('/api/companies');
  return companies.data;
};

const CompaniesRoute: React.VFC = () => {
  const [session, isLoadingUser] = useUserSession();
  const key = session?.id ? `companies/${session.id}` : 'unauthorized';
  const { data: companies } = useSWR(key, fetcher);
  const isLoadingCompanies = typeof companies === 'undefined';

  return (
    <>
      <PageHeader
        title={
          <>
            Mrow,{' '}
            {isLoadingUser ? (
              <Skeleton display="inline-block" w="100px" h=".7em" />
            ) : (
              session?.user?.name
            )}
          </>
        }
        tools={
          <Link href="/create-company" passHref>
            <Button variant="primary" h="100%">
              New company
            </Button>
          </Link>
        }
      />
      <Container maxW="container.lg" py={8}>
        <CompaniesList companies={companies} isLoading={isLoadingCompanies} />
      </Container>
    </>
  );
};

export default CompaniesRoute;
