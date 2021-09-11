import Card from '@/components/atoms/Card';
import { SignatureResponse } from '@/pages/api/company/[slug]/signatures';
import { Heading, Text } from '@chakra-ui/react';
import Link from 'next/link';

type SignatureCardProps = {
  signature: SignatureResponse;
  domain: string;
  href: string;
};
const SignatureCard: React.VFC<SignatureCardProps> = ({ signature, href }) => {
  return (
    <Link href={href} passHref>
      <Card as="a" align="initial">
        <Heading size="sm">{signature.title}</Heading>
        <Text>Using template ‘{signature.template.title}’</Text>
      </Card>
    </Link>
  );
};

export default SignatureCard;
