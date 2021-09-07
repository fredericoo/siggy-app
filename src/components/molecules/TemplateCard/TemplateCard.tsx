import Card from '@/components/atoms/Card/Card';
import { parseHandlebars } from '@/lib/handlebars';
import { generateMockParameters } from '@/lib/mockParameters';
import { Box, Heading, useRadio, UseRadioProps } from '@chakra-ui/react';
import { Template } from '@prisma/client';
import { useMemo } from 'react';

type TemplateCardProps = {
  template: Template;
  domain: string;
} & UseRadioProps;

const TemplateCard: React.VFC<TemplateCardProps> = ({
  template,
  domain,
  isChecked,
  ...props
}) => {
  const { getInputProps, getCheckboxProps } = useRadio({ ...props, isChecked });
  const input = getInputProps();
  const checkbox = getCheckboxProps();

  const html = useMemo(
    () => parseHandlebars(template.html, generateMockParameters(domain)),
    [domain, template.html]
  );

  return (
    <Card isSelected={isChecked} as="label" {...props}>
      <input {...input} />
      <Box
        _checked={{
          bg: 'teal.600',
        }}
        w="100%"
        mb={8}
        flexGrow={1}
        dangerouslySetInnerHTML={{
          __html: html,
        }}
      />
      <Box as="hr" borderColor="gray.200" w="100%" />
      <Heading as="h3" size="sm" fontWeight="normal" {...checkbox}>
        {template.title}
      </Heading>
    </Card>
  );
};

export default TemplateCard;
