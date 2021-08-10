import { Box, Heading, Text } from '@chakra-ui/react';
import { Company } from '@prisma/client';
import Link from 'next/link';

type CompanyCardProps = {
  company: Company;
};

const CompanyCard: React.VFC<CompanyCardProps> = ({ company }) => {
  return (
    <Link href={`/company/${company.slug}`} passHref>
      <Box
        as="a"
        borderRadius="xl"
        p={4}
        border="1px solid"
        borderColor="gray.100"
      >
        <Heading size="sm">{company.title}</Heading>
        <Text>
          <Text as="span" color="gray.400">
            you
          </Text>
          @{company.domain}
        </Text>
      </Box>
    </Link>
  );
};
export default CompanyCard;
