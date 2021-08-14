import prisma from '@/lib/prisma';
import { NextApiHandler } from 'next';
import { getSession } from 'next-auth/client';

const handle: NextApiHandler = async (req, res) => {
  const { companyId } = req.body;

  // If companyId is not a number, return Bad Request
  if (typeof companyId !== 'number') {
    res.status(400).json({
      message: 'Invalid companyId',
    });
    return;
  }

  const session = await getSession({ req });
  // If the user is not logged in, return Unauthorized
  if (!session?.id || typeof session.id !== 'number') {
    res.status(401).json({
      message: 'Unauthorized',
    });
    return;
  }

  const userCompanies = await prisma.user
    .findUnique({ where: { id: session.id } })
    .companies();

  // Do not allow to see a company plan if the user is not part of it
  if (!userCompanies.find((company) => company.id === companyId)) {
    res.status(401).json({
      message: 'Unauthorized',
    });
  }

  const plan = await prisma.company
    .findUnique({ where: { id: companyId } })
    .plan();

  // If company does not have a plan, return 404
  if (!plan) {
    res.status(404).json({
      message: 'Not found',
    });
  }

  const templates = await prisma.template.findMany({
    where: { planId: plan?.id },
  });

  return res.status(200).json({ templates });
};

export default handle;
