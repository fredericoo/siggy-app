import { NextApiHandler } from 'next';
import { getSession } from 'next-auth/client';
import prisma from '@/lib/prisma';
import stripe from '@/lib/stripe';

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
  if (!session) {
    res.status(401).json({
      message: 'Unauthorized',
    });
    return;
  }
  const userCompanies = await prisma.user
    .findUnique({ where: { id: session?.id } })
    .companies();

  const company = userCompanies.find((company) => company.slug === slug);

  if (!company) {
    res.status(401).json({
      message: 'Unauthorized',
    });
    return;
  }

  if (company.subscriptionId)
    await stripe.subscriptions.del(company.subscriptionId);

  await prisma.signature.deleteMany({
    where: { companySlug: slug },
  });

  const result = await prisma.company.delete({
    where: { slug },
  });

  res.json(result);
};

export default handle;
