import { Box, Heading } from '@chakra-ui/react'
import { Company } from '@prisma/client'

type CompanyCardProps = {
  company: Company
}

const CompanyCard: React.VFC<CompanyCardProps> = ({ company }) => {
  return (
    <Box borderRadius="xl" p={4} border="1px solid" borderColor="gray.100">
      <Heading size="sm">{company.title}</Heading>
    </Box>
  )
}
export default CompanyCard
