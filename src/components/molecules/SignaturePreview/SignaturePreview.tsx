import { parseHandlebars } from '@/lib/handlebars';
import { generateMockParameters } from '@/lib/mockParameters';
import { Box, Circle, HStack, SkeletonText } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';

type SignaturePreviewProps = {
  html: string;
  isLoading?: boolean;
  control: ReturnType<typeof useForm>['control'];
  companyParameters: Record<string, string>;
  watchFields?: string[];
};

const SignaturePreview: React.VFC<SignaturePreviewProps> = ({
  control,
  html,
  isLoading,
  companyParameters,
  watchFields,
}) => {
  const buttonSize = '.8rem';
  const mockParameters = useMemo(() => generateMockParameters('siggy.app'), []);
  const fields = useWatch({ control, name: watchFields || [] });

  const formattedHtml = parseHandlebars(
    html,
    { ...Object.fromEntries(watchFields?.map((field, i) => [field, fields[i]]) || []), ...companyParameters },
    mockParameters
  );

  return (
    <Box borderRadius="lg" bg="white" maxW="600px" w="100%" overflow="hidden" mb={4} boxShadow="xl">
      <HStack bg="gray.200" px={4} py={1} userSelect="none">
        <HStack flex="1" spacing={1}>
          {Array(3)
            .fill('button')
            .map((_, key) => (
              <Circle key={key} w={buttonSize} h={buttonSize} bg="gray.300" />
            ))}
        </HStack>
        <Box color="gray.600" flexGrow={1} fontSize="sm" textAlign="center">
          Email message
        </Box>
        <Box flex="1" />
      </HStack>
      <Box p={4}>
        <SkeletonText mb={4} noOfLines={3} speed={0} endColor="gray.200" />
        <SkeletonText mb={4} noOfLines={4} speed={0} endColor="gray.200" />

        {isLoading ? (
          <SkeletonText mb={2} noOfLines={3} />
        ) : (
          <Box
            dangerouslySetInnerHTML={{
              __html: formattedHtml,
            }}
          />
        )}
      </Box>
    </Box>
  );
};
export default SignaturePreview;
