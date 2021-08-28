import Breadcrumbs, {
  Breadcrumb,
} from '@/components/molecules/Breadcrumbs/Breadcrumbs';
import { Box, Container, Heading } from '@chakra-ui/react';

type PageHeaderProps = {
  title: string;
  breadcrumbs?: Breadcrumb[];
};

const PageHeader: React.VFC<PageHeaderProps> = ({ title, breadcrumbs }) => {
  return (
    <Box>
      <Container maxW="container.lg" py={8}>
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
        <Heading as="h1">{title}</Heading>
      </Container>
    </Box>
  );
};

export default PageHeader;
