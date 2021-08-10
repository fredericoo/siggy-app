import { NextApiHandler } from 'next';
import { getSession } from 'next-auth/client';
import prisma from '@/lib/prisma';

const handle: NextApiHandler = async (req, res) => {
  const { slug } = req.body;

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

  if (!userCompanies.find((company) => company.slug === slug)) {
    res.status(401).json({
      message: 'Unauthorized',
    });
    return;
  }

  const result = await prisma.company.delete({
    where: { slug },
  });

  res.json(result);
};

export default handle;
