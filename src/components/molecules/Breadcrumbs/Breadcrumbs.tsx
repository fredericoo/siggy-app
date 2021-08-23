import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react';
import Link from 'next/link';

export type Breadcrumb = { href: string; label: string };

type BreadcrumbsProps = { items: Breadcrumb[] };

const Breadcrumbs: React.VFC<BreadcrumbsProps> = ({ items }) => {
  return (
    <Breadcrumb separator="→" fontSize="sm" color="rgba(0,0,0,0.3)">
      {items.map((breadcrumb, index) => (
        <BreadcrumbItem key={index} isCurrentPage={index === items.length - 1}>
          <Link href={breadcrumb.href} passHref>
            <BreadcrumbLink
              color="rgba(0,0,0,0.6)"
              _hover={{ color: 'rgba(0,0,0,1)' }}
            >
              {breadcrumb.label}
            </BreadcrumbLink>
          </Link>
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  );
};

export default Breadcrumbs;
