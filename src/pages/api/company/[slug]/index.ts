import { NextApiHandler, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import prisma from '@/lib/prisma';
import stripe from '@/lib/stripe';
import { Company } from '.prisma/client';

const handleDelete = async (company: Company, res: NextApiResponse) => {
  if (company.subscriptionId) await stripe.subscriptions.del(company.subscriptionId);

  await prisma.signature.deleteMany({
    where: { companySlug: company.slug },
  });

  try {
    await prisma.company.delete({
      where: { slug: company.slug },
    });
    res.json({ message: 'Company deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Could not delete company', error });
  }
};

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
  const userCompanies = await prisma.user.findUnique({ where: { id: session?.id } }).companies();

  const company = userCompanies.find((company) => company.slug === slug);

  if (!company) {
    res.status(401).json({
      message: 'Unauthorized',
    });
    return;
  }

  if (req.method === 'DELETE') {
    await handleDelete(company, res);
    return;
  }

  if (req.method === 'GET') {
    res.json({ company });
  }
};

export default handle;
