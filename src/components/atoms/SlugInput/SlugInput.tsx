import { Input, InputGroup, FormHelperText, Box, Text, FormControl } from '@chakra-ui/react';
import axios from 'axios';
import { validateSlug } from '@/lib/slug';
import { useEffect, useMemo, useState } from 'react';
import debounce from '@/lib/debounce';
import { useController, useForm, useWatch } from 'react-hook-form';
import Spinner from '@/components/atoms/Spinner';
import FormErrorHelper from '@/components/molecules/FormErrorHelper/FormErrorHelper';
import type { FormInputs } from '@/pages/create-company';

// eslint-disable-next-line react-hooks/rules-of-hooks
const wrapperuseForm = () => useForm<FormInputs>();

type Props = {
  control: ReturnType<typeof wrapperuseForm>['control'];
  name: keyof FormInputs;
};

const SlugInput: React.VFC<Props> = ({ control, name }) => {
  const [isUnique, setIsUnique] = useState<boolean | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const {
    field,
    fieldState: { error, isTouched },
  } = useController({
    name,
    control,
    rules: {
      required: true,
      validate: validateSlug,
    },
    defaultValue: '',
  });
  const slug = useWatch({
    control,
    name,
    defaultValue: '',
  });

  const checkForUniqueSlug = useMemo(() => {
    const checkSlug = async (slug: string) => {
      setIsUnique(undefined);
      setIsLoading(true);
      try {
        if (!validateSlug(slug)) throw new Error('Invalid slug');
        const response = await axios.post('/api/unique-slug', {
          slug,
        });
        setIsUnique(response.data.isUnique === true);
      } catch {
        setIsUnique(false);
      }
      setIsLoading(false);
    };
    return debounce(checkSlug, 1000);
  }, []);

  useEffect(() => checkForUniqueSlug(slug), [slug, checkForUniqueSlug]);

  const isInvalid = (!!error || isUnique === false) && isTouched;
  return (
    <FormControl isInvalid={isInvalid}>
      <FormHelperText>
        <Box display="flex">
          <Text flexGrow={1} whiteSpace="nowrap">{`https://siggy.io/company/`}</Text>
          <InputGroup>
            <Input
              autoComplete="off"
              borderRadius="none"
              bg={isInvalid ? 'red.100' : 'inherit'}
              fontSize="inherit"
              display="inline-block"
              variant="unstyled"
              type="text"
              _focus={{ bg: 'gray.100' }}
              {...field}
            />
            {isLoading && <Spinner size={4} />}
          </InputGroup>
        </Box>
        <FormErrorHelper error={isUnique === false && !error ? { type: 'notUnique' } : error} />
        {isUnique && !isLoading && <FormHelperText color="green.500">The url is available 🐈‍⬛</FormHelperText>}
      </FormHelperText>
    </FormControl>
  );
};

export default SlugInput;
