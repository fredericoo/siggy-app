import { FormErrorMessage } from '@chakra-ui/react';
import { FieldError } from 'react-hook-form';

const errorMessages = {
  validate: 'The pattern does not match the required format.',
  required: 'This field is required.',
  notUnique: 'This URL is not unique.',
};

type FormErrorHelperProps = {
  error?: FieldError;
};

const FormErrorHelper: React.VFC<FormErrorHelperProps> = ({ error }) => {
  if (!error || !error.type) return null;
  const errorMessage = Object.entries(errorMessages).find(
    ([key]) => key === error.type
  );

  return (
    <FormErrorMessage>
      {Array.isArray(errorMessage) ? errorMessage[1] : error.type}
    </FormErrorMessage>
  );
};

export default FormErrorHelper;
