import { NextApiHandler } from 'next';
import { getSession } from 'next-auth/client';
import prisma from '@/lib/prisma';

const handle: NextApiHandler = async (req, res) => {
  const { title, domain, slug, planId } = req.body;

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

  const result = await prisma.company.create({
    data: {
      title,
      domain,
      slug,
      plan: { connect: { id: planId } },
      admin: { connect: { id: session?.id } },
    },
  });
  res.json(result);
};

export default handle;
