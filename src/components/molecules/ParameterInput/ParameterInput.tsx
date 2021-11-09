import { FormControl, FormLabel, Input } from '@chakra-ui/react';
import { useController } from 'react-hook-form';
import FormErrorHelper from '@/components/molecules/FormErrorHelper';
import { useMemo } from 'react';
import ImagePreview from './ImagePreview';

type ParameterInputProps = {
  type?: string;
  defaultValue?: string;
  isRequired?: boolean;
  name: string;
  label?: string;
  isDisabled?: boolean;
  highlightDirty?: boolean;
};

const ParameterInput: React.FC<ParameterInputProps> = ({
  type,
  label,
  defaultValue,
  name,
  isRequired,
  isDisabled,
  highlightDirty,
}) => {
  const {
    field,
    fieldState: { isDirty, error },
  } = useController({ name, defaultValue, rules: { required: isRequired } });

  const input = useMemo(() => {
    const color = !isDirty ? 'gray.400' : undefined;
    const dirtyStyles = highlightDirty ? { color, _focus: { color }, _hover: { color } } : {};

    switch (type) {
      case 'string':
        return (
          <Input
            isRequired={false}
            type="text"
            defaultValue={defaultValue}
            isDisabled={isDisabled}
            {...field}
            {...dirtyStyles}
          />
        );
      case 'email':
        return (
          <Input
            isRequired={false}
            isDisabled={isDisabled}
            type="email"
            defaultValue={defaultValue}
            {...field}
            {...dirtyStyles}
          />
        );
      case 'image':
        return (
          <>
            <ImagePreview fieldName={name} defaultValue={defaultValue} />
            <Input
              size="xs"
              isRequired={false}
              type="text"
              defaultValue={defaultValue}
              isDisabled={isDisabled}
              {...field}
              {...dirtyStyles}
            />
          </>
        );
      default:
        return null;
    }
  }, [defaultValue, field, highlightDirty, isDirty, isDisabled, name, type]);

  return (
    <FormControl isRequired={isRequired} isInvalid={!!error}>
      {label && <FormLabel>{label}</FormLabel>}
      {input}
      <FormErrorHelper error={error} />
    </FormControl>
  );
};

export default ParameterInput;
