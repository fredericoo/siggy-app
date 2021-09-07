import prisma from '@/lib/prisma';
import { validateSlug } from '@/lib/slug';
import { NextApiHandler } from 'next';
import { getSession } from 'next-auth/client';

const handle: NextApiHandler = async (req, res) => {
  const { slug } = req.body;

  if (!validateSlug(slug)) {
    res.json({
      error: 'Slug format is not valid.',
    });
    return;
  }

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
      isUnique: false,
      error: `A company with the slug “${slug}” already exists.`,
    });
    return;
  }
  return res.status(200).json({ isUnique: true });
};

export default handle;
