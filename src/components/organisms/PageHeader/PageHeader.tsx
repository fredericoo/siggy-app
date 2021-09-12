import Breadcrumbs, {
  Breadcrumb,
} from '@/components/molecules/Breadcrumbs/Breadcrumbs';
import { Box, Container, Heading, Stack } from '@chakra-ui/react';
import { ReactNode } from 'react';

type PageHeaderProps = {
  title: ReactNode;
  breadcrumbs?: Breadcrumb[] | false;
  tools?: ReactNode;
};

const PageHeader: React.VFC<PageHeaderProps> = ({
  title,
  breadcrumbs,
  tools,
}) => {
  return (
    <Box>
      <Container maxW="container.lg" py={8}>
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
        <Stack direction={{ base: 'column', md: 'row' }} spacing={8}>
          <Heading as="h1" flexGrow={1}>
            {title}
          </Heading>
          {tools}
        </Stack>
      </Container>
    </Box>
  );
};

export default PageHeader;
