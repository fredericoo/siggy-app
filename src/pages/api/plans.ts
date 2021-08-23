import prisma from '@/lib/prisma';
import { NextApiHandler } from 'next';

const handle: NextApiHandler = async (_, res) => {
  const plans = await prisma.plan?.findMany();
  if (plans) {
    return res.status(200).json(plans);
  }
  return res.status(404).json({ error: 'Not Found' });
};

export default handle;
