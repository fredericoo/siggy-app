import { NextApiHandler } from 'next';
import { getSession } from 'next-auth/client';
import prisma from '@/lib/prisma';
import stripe from '@/lib/stripe';

const handle: NextApiHandler = async (req, res) => {
  const { title, domain, slug, priceId } = req.body;

  const host = req.headers.host || 'localhost:3000';

  const session = await getSession({ req });
  if (!session) {
    res.json({
      error: 'You are not logged in.',
    });
    return;
  }

  const isUnique = !(await prisma.company.findUnique({
    where: { slug },
    select: { slug: true },
  }));
  if (!isUnique) {
    res.json({
      error: `A company with the slug “${slug}” already exists.`,
    });
    return;
  }

  const stripeSession = await stripe.checkout.sessions.create({
    success_url: `http://${host}/company/${slug}`,
    cancel_url: `http://${host}/company/${slug}`,
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
  });
  const total = stripeSession?.amount_total || 0;

  const result = await prisma.company.create({
    data: {
      title,
      domain,
      slug,
      priceId,
      sessionId: stripeSession.id,
      admin: { connect: { id: session?.id } },
    },
  });

  res.json({ ...result, redirectURL: total > 0 ? stripeSession.url : `/company/${slug}` });
};

export default handle;
