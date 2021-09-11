import { Button } from '@chakra-ui/button';
import axios from 'axios';
import useSWR from 'swr';
import Link from 'next/link';
import {
  Text,
  Badge,
  VStack,
  Box,
  ComponentWithAs,
  StackProps,
  Skeleton,
} from '@chakra-ui/react';
import { format, fromUnixTime } from 'date-fns';
import { SubscriptionResponse } from '@/pages/api/company/[slug]/subscription';
import Stripe from 'stripe';

type SubscriptionStatusProps = {
  companySlug: string;
};

const fetcher = async (url: string) =>
  await axios.get<SubscriptionResponse>(url);

const SubscriptionStatus: ComponentWithAs<
  'div',
  StackProps & SubscriptionStatusProps
> = ({ companySlug, ...props }) => {
  const {
    data: response,
    error,
    revalidate,
  } = useSWR(`/api/company/${companySlug}/subscription`, fetcher, {
    revalidateOnFocus: false,
  });
  const subscription = response?.data;

  if (!response && !error) {
    return (
      <VStack {...props}>
        <Skeleton h="1rem">Status: Loading</Skeleton>
        <Skeleton h=".6rem"></Skeleton>
      </VStack>
    );
  }

  if (error || (subscription && 'error' in subscription))
    return (
      <VStack {...props}>
        <Box>Failed to load plan status :(</Box>
        <Button onClick={revalidate} variant="secondary" size="sm">
          Reload
        </Button>
      </VStack>
    );

  return (
    <VStack {...props}>
      <StatusBox
        isFree={subscription?.isFree}
        status={subscription?.status}
        renewOn={subscription?.current_period_end}
        payUrl={subscription?.payUrl}
      />
    </VStack>
  );
};

type StatusBoxProps = {
  isFree?: boolean;
  status?: Stripe.Subscription.Status;
  renewOn?: number;
  payUrl?: string;
};
const StatusBox: React.VFC<StatusBoxProps> = ({
  isFree,
  status,
  renewOn,
  payUrl,
}) => {
  const getBadgeColourScheme = (status?: Stripe.Subscription.Status) => {
    switch (status) {
      case 'active':
        return 'green';
      default:
        return 'red';
    }
  };

  if (isFree || !status)
    return (
      <Box>
        <Badge colorScheme="blackAlpha">Free plan</Badge>
        <Text fontSize="xs" color="gray.500">
          Offers limited functionality. Upgrade to unlock templates and
          features.
        </Text>
      </Box>
    );

  return (
    <Box>
      Subscription:{' '}
      <Badge colorScheme={getBadgeColourScheme(status)}>{status}</Badge>
      {status === 'unpaid' && (
        <>
          <Text fontSize="xs" color="gray.500">
            Features are locked until you update your subscription.
          </Text>
          {payUrl && (
            <Link href={payUrl} passHref>
              <Button colorScheme="green" variant="ghost" size="sm">
                Pay via Stripe
              </Button>
            </Link>
          )}
        </>
      )}
      {status === 'active' && renewOn && (
        <Text fontSize="xs" color="gray.500">
          renew: {format(fromUnixTime(renewOn), 'P')}
        </Text>
      )}
    </Box>
  );
};

export default SubscriptionStatus;
