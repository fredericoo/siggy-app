import { parseHandlebars } from '@/lib/handlebars';
import {
  Button,
  useClipboard,
  Modal,
  ModalOverlay,
  ModalContent,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  ModalCloseButton,
  Heading,
  useDisclosure,
  Text,
  Code,
  Kbd,
  styled,
  Box,
  Stack,
} from '@chakra-ui/react';
import { useForm, useWatch } from 'react-hook-form';
import { GmailStepOne } from './steps/GmailSteps';

type Props = {
  html?: string;
  isDisabled?: boolean;
  control: ReturnType<typeof useForm>['control'];
};

const Step = styled(Box);

const ExportSignatureMenu: React.FC<Props> = ({ html, isDisabled, children, control }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const fields = useWatch({ control });
  const { onCopy, hasCopied } = useClipboard(parseHandlebars(html || '', fields), {
    format: 'text/html',
    timeout: 1000,
  });
  if (!html) return null;

  return (
    <>
      <Button w="100%" variant="primary" isDisabled={isDisabled} onClick={onOpen}>
        {children}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay />
        <ModalContent p={2}>
          <ModalCloseButton />
          <Tabs>
            <TabList>
              <Tab>Gmail</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Stack spacing={8}>
                  <Step>
                    <GmailStepOne />
                    <Heading size="sm" as="h3">
                      Go to the settings page
                    </Heading>
                    <Text>Click on the cogwheel icon on the top right hand side of gmail.</Text>
                  </Step>

                  <Step>
                    <Heading size="sm" as="h3">
                      Add a new signature
                    </Heading>
                    <Text>
                      Under Signature, tap the <Kbd>Create New</Kbd> button and name your signature. A cool name would
                      be something like <Code>Amazing new signature</Code>
                    </Text>
                  </Step>

                  <Step>
                    <Heading size="sm" as="h3">
                      Paste the signature
                    </Heading>
                    <Text>Copy the signature and paste it into the text field.</Text>

                    <Button onClick={onCopy}>{hasCopied ? 'Done!' : 'Copy to clipboard'}</Button>
                  </Step>

                  <Step>
                    <Heading size="sm" as="h3">
                      Save the signature
                    </Heading>
                    <Text>
                      Click on the <Kbd>Save Changes</Kbd> button at the bottom.
                    </Text>
                  </Step>
                </Stack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ExportSignatureMenu;
