import { NextApiHandler } from 'next';
import { getSession } from 'next-auth/client';
import prisma from '@/lib/prisma';
import stripe from '@/lib/stripe';

const handle: NextApiHandler = async (req, res) => {
  const { title, domain, slug, priceId } = req.body;

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
    success_url: `http://localhost:3000/company/${slug}`,
    cancel_url: `http://localhost:3000/company/${slug}`,
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
  });

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
  res.json({ ...result, redirectURL: stripeSession.url });
};

export default handle;
