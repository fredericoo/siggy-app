import { generateMockParameters } from '@/lib/mockParameters';
import { SignatureResponse } from '@/pages/api/company/signatures';
import { Box, Heading } from '@chakra-ui/react';
import Handlebars from 'handlebars';

type SignatureCardProps = {
  signature: SignatureResponse;
  domain: string;
};
const SignatureCard: React.VFC<SignatureCardProps> = ({
  signature,
  domain,
}) => {
  const template = Handlebars.compile(signature.template.html);

  return (
    <Box
      p={4}
      border="1px solid"
      borderColor="gray.200"
      borderRadius="xl"
      key={signature.id}
    >
      <Heading size="sm">{signature.template.title}</Heading>
      <Box
        dangerouslySetInnerHTML={{
          __html: template(generateMockParameters(domain)),
        }}
      />
    </Box>
  );
};

export default SignatureCard;
