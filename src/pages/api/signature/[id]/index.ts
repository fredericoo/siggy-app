import { NextApiHandler, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import prisma from '@/lib/prisma';
import { Signature } from '.prisma/client';

const handleDelete = async (signature: Pick<Signature, 'id'>, res: NextApiResponse) => {
  try {
    await prisma.signature.delete({
      where: { id: signature.id },
    });
    res.json({ message: 'Signature deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Could not delete company', error });
  }
};

const handle: NextApiHandler = async (req, res) => {
  const { id } = req.query;

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
    select: { id: true, companySlug: true },
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

  if (req.method === 'DELETE') {
    await handleDelete(signature, res);
    return;
  }

  if (req.method === 'GET') {
    res.json({ signature });
  }
};

export default handle;
