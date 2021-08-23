import Card from '@/components/atoms/Card/Card';
import { Box, Heading, ListItem, Text, UnorderedList } from '@chakra-ui/react';
import { Plan } from '@prisma/client';
import { TERMS } from './terms';

export type PlanCardProps = {
  plan: Plan;
  isSelected?: boolean;
  onSelect?: (planId: number) => void;
};

const PlanCard: React.VFC<PlanCardProps> = ({ plan, isSelected, onSelect }) => {
  const terms = TERMS.plans[plan.title];
  return (
    <Card
      type="button"
      onClick={() => onSelect && onSelect(plan.id)}
      isSelected={isSelected}
    >
      <Heading as="h3" size="sm">
        {terms.title || plan.title}
      </Heading>
      <Text fontSize="sm" color="gray.600">
        {terms.description}
      </Text>
      <UnorderedList flexGrow={1} w="100%" fontSize="sm" pl={4}>
        {terms.features.map((feature) => (
          <ListItem key={feature}>{feature}</ListItem>
        ))}
      </UnorderedList>

      {typeof plan.monthlyFee === 'number' && (
        <Box pt={4}>
          {Intl.NumberFormat('en-GB', {
            style: 'currency',
            currency: 'GBP',
          }).format(plan.monthlyFee)}{' '}
          <Text as="span" fontSize="xs">
            {TERMS.ppm}
          </Text>
        </Box>
      )}
    </Card>
  );
};

export default PlanCard;
