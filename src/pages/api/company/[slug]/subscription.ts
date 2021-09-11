import prisma from '@/lib/prisma';
import stripe from '@/lib/stripe';
import { ErrorMessage } from '@/lib/types';
import { NextApiHandler } from 'next';
import { getSession } from 'next-auth/client';
import Stripe from 'stripe';

type Subscription = {
  isFree: boolean;
  status: Stripe.Subscription.Status;
  current_period_end?: number;
  payUrl?: string;
};

export type SubscriptionResponse = Subscription | ErrorMessage;

const handle: NextApiHandler = async (req, res) => {
  const { slug } = req.query;

  // If company slug is not a string, return Bad Request
  if (typeof slug !== 'string') {
    res.status(400).json({
      error: `Invalid company: ${slug}`,
    });
    return;
  }

  const session = await getSession({ req });
  // If the user is not logged in, return Unauthorized
  if (!session?.id) {
    res.status(401).json({
      error: 'User not logged in',
    });
    return;
  }

  const userCompanies = await prisma.user.findUnique({
    where: { id: session.id },
    select: {
      companies: {
        where: { slug: slug },
        select: { sessionId: true, subscriptionId: true, priceId: true },
      },
    },
  });

  if (!userCompanies) {
    res.status(401).json({
      error: 'User not part of the company',
    });
    return;
  }

  const {
    subscriptionId: companySubscriptionId,
    sessionId,
    priceId,
  } = userCompanies.companies[0];

  const price =
    (await (await stripe.prices.retrieve(priceId)).unit_amount) || 0;

  let subscriptionId = companySubscriptionId;
  let stripeSession;
  let stripeSubscription;

  if (sessionId && !subscriptionId) {
    stripeSession = await stripe.checkout.sessions.retrieve(sessionId);
    if (typeof stripeSession.subscription === 'string') {
      await prisma.company.update({
        where: { slug: slug },
        data: { subscriptionId: stripeSession.subscription },
      });
      subscriptionId = stripeSession.subscription;
    }
  }

  if (subscriptionId) {
    stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
  }

  const response = {
    isFree: price <= 0,
    status: stripeSubscription?.status || 'unpaid',
    current_period_end: stripeSubscription?.current_period_end,
    payUrl: stripeSession?.url || undefined,
  };

  return res.status(200).json(response);
};

export default handle;
