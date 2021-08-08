import {
  Box,
  Heading,
  ListItem,
  Text,
  UnorderedList,
  VStack,
} from '@chakra-ui/react'
import { Plan } from '@prisma/client'
import { TERMS } from './terms'

type PlanCardProps = {
  plan: Plan
  isSelected?: boolean
  onSelect?: (planId: number) => void
}

const PlanCard: React.VFC<PlanCardProps> = ({ plan, isSelected, onSelect }) => {
  const terms = TERMS.plans[plan.title]
  return (
    <VStack
      borderRadius="xl"
      p={4}
      onClick={() => onSelect && onSelect(plan.id)}
      border="2px solid"
      borderColor={isSelected ? 'orange.200' : 'gray.100'}
      _hover={{ bg: 'gray.50' }}
      cursor="pointer"
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
      <Box pt={4}>
        {Intl.NumberFormat('en-GB', {
          style: 'currency',
          currency: 'GBP',
        }).format(plan.monthlyFee)}{' '}
        <Text as="span" fontSize="xs">
          {TERMS.ppm}
        </Text>
      </Box>
    </VStack>
  )
}

export default PlanCard
