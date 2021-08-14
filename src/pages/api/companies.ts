import prisma from '@/lib/prisma';
import { NextApiHandler } from 'next';
import { getSession } from 'next-auth/client';

const handle: NextApiHandler = async (req, res) => {
  const session = await getSession({ req });
  if (!session?.id || typeof session.id !== 'number') {
    res.status(401).json({
      message: 'Unauthorized',
    });
    return;
  }
  const companies = await prisma.user
    .findUnique({ where: { id: session.id } })
    .companies();

  if (companies) {
    return res.status(200).json(companies);
  }
  return res.status(404).json({ error: 'Not Found' });
};

export default handle;
