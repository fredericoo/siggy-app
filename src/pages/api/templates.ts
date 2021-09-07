// import prisma from '@/lib/prisma';
import prisma from '@/lib/prisma';
import { NextApiHandler } from 'next';

const handle: NextApiHandler = async (_, res) => {
  const templates = await prisma.template.findMany();

  if (templates) {
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate');
    return res
      .status(200)
      .json(templates.sort((a, b) => a.minPrice - b.minPrice));
  }
  return res.status(404).json({ error: 'Not Found' });
};

export default handle;
