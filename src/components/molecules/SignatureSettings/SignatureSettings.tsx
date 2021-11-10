import ActionSheet from '@/components/molecules/ActionSheet';
import DeleteButton from '@/components/molecules/DeleteButton';
import { useClipboard } from '@chakra-ui/hooks';
import { SimpleGrid, Text, Box } from '@chakra-ui/layout';
import { Switch } from '@chakra-ui/switch';
import { useToast } from '@chakra-ui/toast';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

type Props = {
  signatureId: string;
  companySlug: string;
};

const fetcher = async (endpoint: string) => axios.get(endpoint).then((res) => res.data);

const SignaturePublicSwitch: React.VFC<Props> = ({ signatureId, companySlug }) => {
  const { push } = useRouter();
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const toast = useToast();

  const [fullUrl, setFullUrl] = useState('');
  const { onCopy } = useClipboard(fullUrl);
  useEffect(() => {
    setFullUrl(window.location.href);
  }, []);

  const { data: settings, mutate } = useSWR(`/api/signature/${signatureId}/settings`, fetcher);
  useEffect(() => {
    setIsPublic(settings?.isPublic);
  }, [settings]);

  const handleDelete = async () => {
    setIsLoadingDelete(true);
    try {
      const request = await axios.delete(`/api/signature/${signatureId}`);
      if (request.status === 200) {
        push(`/company/${companySlug}`);
      }
    } catch (e) {
      console.log(e);
    }
    setIsLoadingDelete(false);
  };

  const handlePublicSwitch = async () => {
    setIsPublic(!isPublic);
    try {
      const request = await axios.put(`/api/signature/${signatureId}/settings`, { isPublic: !isPublic });
      const id = isPublic ? 'public' : 'private';
      if (request.status === 200 && !toast.isActive(id)) {
        toast({
          id,
          title: 'Done.',
          description: !isPublic ? 'The signature is now Public' : 'The signature is now Private',
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
      }
      setTimeout(mutate, 200);
    } catch (e) {
      console.warn(e);
    }
  };

  const handleCopy = () => {
    toast({
      id: 'copied',
      title: 'Copied!',
      description: 'Now share it ;)',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    onCopy();
  };

  return (
    <ActionSheet>
      <SimpleGrid columns={2} rowGap={4} alignItems="center">
        <Text>Public Signature</Text>
        <Switch
          colorScheme="orange"
          justifySelf="end"
          isChecked={isPublic}
          onChange={handlePublicSwitch}
          isDisabled={isPublic !== settings?.isPublic}
        />
        {isPublic && (
          <Box gridColumn="1 / -1">
            <Text color="gray.500" fontSize="sm">
              Share this link with your coworker:
            </Text>
            <Text fontSize="sm" onClick={handleCopy} cursor="pointer" _hover={{ bg: 'orange.100' }}>
              {fullUrl}
            </Text>
          </Box>
        )}
        <Text>Danger zone</Text>
        <DeleteButton isLoading={isLoadingDelete} onDelete={handleDelete}>
          Delete Signature
        </DeleteButton>
      </SimpleGrid>
    </ActionSheet>
  );
};

export default SignaturePublicSwitch;
