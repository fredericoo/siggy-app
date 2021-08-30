import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
  HStack,
  ComponentWithAs,
  ButtonProps,
} from '@chakra-ui/react';
import { SyntheticEvent, useState } from 'react';

type DeleteButtonProps = {
  onDelete: () => void;
  isLoading?: boolean;
  keyword?: string;
};

const DeleteButton: ComponentWithAs<'button', ButtonProps & DeleteButtonProps> =
  ({ onDelete, children, keyword = 'DELETE', isLoading, ...props }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [input, setInput] = useState('');

    const handleSubmit = (event: SyntheticEvent<HTMLInputElement>) => {
      event.preventDefault();
      onDelete();
    };

    return (
      <>
        <Button variant="danger" onClick={onOpen} {...props}>
          {children}
        </Button>
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalBody py={6}>
              <VStack
                align="flex-start"
                spacing={4}
                as="form"
                onSubmit={handleSubmit}
              >
                <Text>
                  To delete, please type the word{' '}
                  <Text as="span" fontWeight="bold">
                    {keyword}
                  </Text>{' '}
                  in the box below.
                </Text>
                <Input
                  isDisabled={isLoading}
                  type="text"
                  onChange={(e) => setInput(e.target.value)}
                  value={input}
                />
                <HStack spacing={4}>
                  <Button
                    type="submit"
                    variant="danger"
                    isLoading={isLoading}
                    isDisabled={keyword !== input}
                  >
                    Delete
                  </Button>
                  <Text>or</Text>
                  <Button
                    onClick={onClose}
                    variant="link"
                    isDisabled={isLoading}
                  >
                    Cancel
                  </Button>
                </HStack>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    );
  };

export default DeleteButton;
