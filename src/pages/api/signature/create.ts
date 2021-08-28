import { NextApiHandler } from 'next';
import { getSession } from 'next-auth/client';
import prisma from '@/lib/prisma';

const handle: NextApiHandler = async (req, res) => {
  const { title, templateId, companySlug } = req.body;

  const session = await getSession({ req });
  if (!session) {
    res.json({
      error: 'You are not logged in.',
    });
    return;
  }

  if (!title || !templateId || !companySlug) {
    res.json({ error: 'One or more fields are missing' });
    return;
  }

  const userCompanies = await prisma.user
    .findUnique({ where: { id: session.id } })
    .companies();

  const company = userCompanies.find((company) => company.slug === companySlug);
  if (!company) {
    res.json({ error: 'Company not found' });
    return;
  }

  const result = await prisma.signature.create({
    data: {
      title,
      company: { connect: { slug: companySlug } },
      template: { connect: { id: templateId } },
    },
  });
  res.json(result);
};

export default handle;
