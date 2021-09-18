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
import { forwardRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import ActionSheet from '../ActionSheet/ActionSheet';
import FormErrorHelper from '../FormErrorHelper/FormErrorHelper';

type ParametersFormProps = {
  domain?: string;
  parameters?: TemplateParametersResponse;
  defaultValues?: Record<string, string>;
  onAction: (formData: Record<string, string>) => void;
  actionLabel: string;
  isDisabled?: boolean;
};

const ParametersForm: React.VFC<ParametersFormProps> = ({
  parameters,
  defaultValues,
  domain,
  onAction,
  actionLabel,
  isDisabled,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    defaultValues &&
      Object.entries(defaultValues).forEach(([key, value]) => {
        setValue(key, value);
      });
  }, [setValue, defaultValues]);

  return (
    <ActionSheet>
      <VStack as="form" onSubmit={handleSubmit(onAction)} spacing={6}>
        {parameters?.map((parameter) => (
          <FormControl
            key={parameter.handlebar}
            isRequired={parameter.isRequired}
            isInvalid={!!errors[parameter.handlebar]}
          >
            <FormLabel>{parameter.title}</FormLabel>
            <ParameterInput
              type={parameter?.type?.title || 'string'}
              domain={domain}
              {...register(parameter.handlebar, {
                required: parameter.isRequired,
              })}
              isDisabled={isDisabled}
            />
            <FormErrorHelper error={errors[parameter.handlebar]} />
          </FormControl>
        ))}
        <Button type="submit" variant="secondary" isDisabled={isDisabled}>
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

const ParameterInput = forwardRef<
  HTMLInputElement,
  InputProps & ParameterInputProps
>(({ type, defaultValue, domain, ...props }, ref) => {
  switch (type) {
    case 'string':
      return (
        <Input
          ref={ref}
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
            ref={ref}
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
});
ParameterInput.displayName = 'ParameterInput';

export default ParametersForm;
