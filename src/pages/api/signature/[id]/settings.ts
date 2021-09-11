import { NextApiHandler } from 'next';
import { getSession } from 'next-auth/client';
import prisma from '@/lib/prisma';

const handle: NextApiHandler = async (req, res) => {
  const { id } = req.query;
  const { isPublic } = req.body;

  if (typeof id !== 'string') {
    res.status(400).json({
      error: `Invalid signature ID: ${id}`,
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

  const signature = await prisma.signature.findUnique({
    where: { id },
    select: { companySlug: true, isPublic: true },
  });

  if (!signature) {
    res.status(404).json({
      message: 'No signature with ID found',
    });
    return;
  }

  const company = await prisma.company.findFirst({
    where: { slug: signature.companySlug, adminId: session.id },
  });

  if (!company) {
    res.status(401).json({
      message: 'Unauthorized',
    });
    return;
  }

  if (req.method === 'PUT') {
    const result = await prisma.signature.update({
      where: { id },
      data: { isPublic },
    });
    res.json(result);
    return;
  }

  res.json({ isPublic: signature.isPublic });
};

export default handle;
