import prisma from '@/lib/prisma';
import { Signature, Template } from '@prisma/client';
import { NextApiHandler } from 'next';
import { getSession } from 'next-auth/client';

export type SignatureResponse = Pick<Signature, 'id'> & {
  template: Pick<Template, 'html' | 'title'>;
};

type ErrorMessage = { error: string };

export type SignaturesQueryResponse = SignatureResponse[] | ErrorMessage;

const handle: NextApiHandler = async (req, res) => {
  const { companySlug } = req.query;

  // If companyId is not a number, return Bad Request
  if (typeof companySlug !== 'string') {
    res.status(400).json({
      error: `Invalid company: ${companySlug}`,
    });
    return;
  }

  const session = await getSession({ req });
  // If the user is not logged in, return Unauthorized
  if (!session?.id) {
    res.status(401).json({
      error: 'User not logged in',
    });
    return;
  }

  const userCompanies = await prisma.user
    .findUnique({ where: { id: session.id } })
    .companies({ select: { slug: true } });

  // Do not allow to see a company plan if the user is not part of it
  if (!userCompanies.find((company) => company.slug === companySlug)) {
    res.status(401).json({
      error: 'User not part of the company',
    });
    return;
  }

  const signatures = await prisma.signature.findMany({
    where: { companySlug },
    select: { id: true, template: { select: { html: true, title: true } } },
  });

  return res.status(200).json(signatures);
};

export default handle;
