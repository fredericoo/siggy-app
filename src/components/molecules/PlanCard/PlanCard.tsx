import Card from '@/components/atoms/Card';
import { Plan } from '@/types/plan';
import { Box, Heading, Text } from '@chakra-ui/react';

export type PlanCardProps = {
  plan: Plan;
  isSelected?: boolean;
  onSelect?: (planId: string) => void;
};

const PlanCard: React.VFC<PlanCardProps> = ({ plan, isSelected, onSelect }) => {
  return (
    <Card type="button" onClick={() => onSelect && onSelect(plan.price.id)} isSelected={isSelected}>
      <Heading as="h3" size="sm">
        {plan.product.name}
      </Heading>
      <Text fontSize="sm" color="gray.600">
        {plan.product.description}
      </Text>

      {plan.price.unit_amount && (
        <Box pt={4}>
          {Intl.NumberFormat('en-GB', {
            style: 'currency',
            currency: plan.price.currency,
          }).format(plan.price.unit_amount / 100)}{' '}
          <Text as="span" fontSize="xs">
            /{plan.price.recurring?.interval}
          </Text>
        </Box>
      )}
    </Card>
  );
};

export default PlanCard;
