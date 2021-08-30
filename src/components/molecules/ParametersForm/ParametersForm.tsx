import Spinner from '@/components/atoms/Spinner';
import { TemplateParametersResponse } from '@/pages/api/template/[templateId]/parameters';
import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputProps,
  InputRightAddon,
  VStack,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import ActionSheet from '../ActionSheet/ActionSheet';
import FormErrorHelper from '../FormErrorHelper/FormErrorHelper';
import Message from '../Message';

type ParametersFormProps = {
  domain?: string;
  parameters?: TemplateParametersResponse;
  isLoading?: boolean;
  onPreview: (formData: Record<string, string>) => void;
};

const ParametersForm: React.VFC<ParametersFormProps> = ({
  parameters,
  isLoading,
  domain,
  onPreview,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  if (isLoading) return <Spinner />;
  if (!parameters || !parameters.length)
    return <Message heading="Could not load parameters" />;
  return (
    <ActionSheet>
      <Heading as="h2" size="md" mb={4}>
        Customise your signature
      </Heading>
      <VStack as="form" onSubmit={handleSubmit(onPreview)} spacing={6}>
        {parameters.map((parameter) => (
          <FormControl
            key={parameter.id}
            isRequired={parameter.isRequired}
            isInvalid={!!errors[parameter.handlebar]}
          >
            <FormLabel>{parameter.title}</FormLabel>
            <ParameterInput
              type={parameter.type.title}
              domain={domain}
              {...register(parameter.handlebar)}
            />
            <FormErrorHelper error={errors[parameter.handlebar]} />
          </FormControl>
        ))}
        <Button type="submit" variant="secondary">
          Preview
        </Button>
      </VStack>
    </ActionSheet>
  );
};

type ParameterInputProps = {
  type: string;
  defaultValue?: string;
  domain?: string;
};
const ParameterInput: React.VFC<InputProps & ParameterInputProps> = ({
  type,
  defaultValue,
  domain,
  ...props
}) => {
  switch (type) {
    case 'string':
      return (
        <Input isRequired={false} type="text" value={defaultValue} {...props} />
      );
    case 'email':
      return (
        <InputGroup>
          <Input
            isRequired={false}
            type="text"
            value={defaultValue}
            {...props}
          />
          <InputRightAddon flexGrow={1}>
            @{domain ?? 'siggy.io'}
          </InputRightAddon>
        </InputGroup>
      );
    default:
      return null;
  }
};

export default ParametersForm;
