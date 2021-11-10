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
import downloadFromHtml from './downloadFromHtml';

type Props = {
  html?: string;
  isDisabled?: boolean;
};

const Step = styled(Box);

const ExportSignatureMenu: React.FC<Props> = ({ html, isDisabled, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { onCopy, hasCopied } = useClipboard(html || '', { format: 'text/html', timeout: 1000 });
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
              <Tab>Outlook</Tab>
              <Tab>Apple Mail</Tab>
              <Tab>Other</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Stack spacing={8}>
                  <Step>
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
                      Click on the <Kbd>Save</Kbd> button.
                    </Text>
                  </Step>
                </Stack>
              </TabPanel>
              <TabPanel>
                <Button onClick={onCopy}>Copy to clipboard</Button>
              </TabPanel>
              <TabPanel>
                <Code borderRadius="md" maxH="6rem" overflow="scroll">
                  {html}
                </Code>
                <Button onClick={() => downloadFromHtml(html, 'signature.html')}>Download html file</Button>
              </TabPanel>
              <TabPanel>
                <Code borderRadius="md" maxH="6rem" overflow="scroll">
                  {html}
                </Code>
                <Button onClick={() => downloadFromHtml(html, 'signature.html')}>Download html file</Button>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ExportSignatureMenu;
