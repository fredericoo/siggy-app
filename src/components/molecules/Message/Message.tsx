import { Button, Heading, Text, VStack } from '@chakra-ui/react';

type MessageProps = {
  heading?: string;
  body?: string;
  Icon?: React.FC;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  action?: string;
};

const Message: React.FC<MessageProps> = ({
  heading,
  body,
  Icon,
  onClick,
  action,
}) => {
  return (
    <VStack spacing={4}>
      {Icon && <Icon />}
      {heading && <Heading size="md">{heading}</Heading>}
      {body && <Text color="gray.600">{body}</Text>}
      {action && onClick && (
        <Button variant="primary" onClick={onClick}>
          {action}
        </Button>
      )}
    </VStack>
  );
};

export default Message;
