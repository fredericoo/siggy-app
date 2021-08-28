import Card from '@/components/atoms/Card';
import { Heading, Text } from '@chakra-ui/react';
import { Company } from '@prisma/client';
import Link from 'next/link';

type CompanyCardProps = {
  company: Company;
};

const CompanyCard: React.VFC<CompanyCardProps> = ({ company }) => {
  return (
    <Link href={`/company/${company.slug}`} passHref>
      <Card as="a">
        <Heading size="sm">{company.title}</Heading>
        <Text>
          <Text as="span" color="gray.400">
            you
          </Text>
          @{company.domain}
        </Text>
      </Card>
    </Link>
  );
};
export default CompanyCard;
