import { TemplateParametersResponse } from '@/pages/api/template/[templateId]/parameters';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightAddon,
  VStack,
  InputProps,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import ActionSheet from '../ActionSheet/ActionSheet';
import FormErrorHelper from '../FormErrorHelper/FormErrorHelper';

type ParametersFormProps = {
  domain?: string;
  parameters?: TemplateParametersResponse;
  values?: Record<string, string>;
  onAction: (formData: Record<string, string>) => void;
  actionLabel: string;
};

const ParametersForm: React.VFC<ParametersFormProps> = ({
  parameters,
  values,
  domain,
  onAction,
  actionLabel,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  return (
    <ActionSheet>
      <VStack as="form" onSubmit={handleSubmit(onAction)} spacing={6}>
        {parameters?.map((parameter) => (
          <FormControl
            key={parameter.id}
            isRequired={parameter.isRequired}
            isInvalid={!!errors[parameter.handlebar]}
          >
            <FormLabel>{parameter.title}</FormLabel>
            <ParameterInput
              type={parameter?.type?.title || 'string'}
              defaultValue={values?.[parameter.handlebar]}
              domain={domain}
              {...register(parameter.handlebar)}
            />
            <FormErrorHelper error={errors[parameter.handlebar]} />
          </FormControl>
        ))}
        <Button type="submit" variant="secondary">
          {actionLabel}
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
        <Input
          isRequired={false}
          type="text"
          defaultValue={defaultValue}
          {...props}
        />
      );
    case 'email':
      return (
        <InputGroup>
          <Input
            isRequired={false}
            type="text"
            defaultValue={defaultValue}
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
