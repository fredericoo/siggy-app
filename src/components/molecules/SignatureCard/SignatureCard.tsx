import { parseHandlebars } from '@/lib/handlebars';
import { generateMockParameters } from '@/lib/mockParameters';
import { SignatureResponse } from '@/pages/api/company/signatures';
import { Box, Heading } from '@chakra-ui/react';
import Link from 'next/link';

type SignatureCardProps = {
  signature: SignatureResponse;
  domain: string;
  href: string;
};
const SignatureCard: React.VFC<SignatureCardProps> = ({
  signature,
  domain,
  href,
}) => {
  const template = parseHandlebars(
    signature.template.html,
    generateMockParameters(domain)
  );

  return (
    <Link href={href} passHref>
      <Box
        as="a"
        p={4}
        border="1px solid"
        borderColor="gray.200"
        borderRadius="xl"
        key={signature.id}
      >
        <Heading size="sm">{signature.template.title}</Heading>
        <Box
          dangerouslySetInnerHTML={{
            __html: template,
          }}
        />
      </Box>
    </Link>
  );
};

export default SignatureCard;
