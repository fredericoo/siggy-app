import Message from '@/components/molecules/Message';
import CompanyCard from '@/components/molecules/CompanyCard';
import { Company } from '@prisma/client';
import { useRouter } from 'next/dist/client/router';
import {
  Box,
  SimpleGrid,
  SkeletonText,
  SkeletonCircle,
  Button,
} from '@chakra-ui/react';

type CompaniesListProps = {
  companies?: Company[];
  isLoading?: boolean;
};

const CompaniesList: React.VFC<CompaniesListProps> = ({
  companies,
  isLoading,
}) => {
  const { push } = useRouter();

  if (isLoading) return <CompaniesLoading />;

  if (companies && companies.length > 0) {
    return (
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={8}>
        {companies.map((company) => (
          <CompanyCard key={company.id} company={company} />
        ))}
        <Button onClick={() => push('/company/create')} h="100%">
          New company
        </Button>
      </SimpleGrid>
    );
  }

  return (
    <Message
      heading="You have no Companies yet."
      body="Start by creating one:"
      action="Create a company"
      onClick={() => {
        push('/company/create');
      }}
    />
  );
};

const CompaniesLoading: React.VFC = () => {
  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={8}>
      {new Array(3).fill(0).map((_, key) => (
        <Box key={key}>
          <SkeletonCircle size="10" />
          <SkeletonText mt="4" noOfLines={4} spacing="4" />
        </Box>
      ))}
    </SimpleGrid>
  );
};

export default CompaniesList;
