import { NextApiHandler } from 'next';
import prisma from '@/lib/prisma';
import { TemplateParameter, TemplateParameterType } from '@prisma/client';

export type TemplateParametersResponse = (TemplateParameter & {
  type?: TemplateParameterType;
})[];

const handle: NextApiHandler = async (req, res) => {
  const { templateId } = req.query;

  if (typeof templateId !== 'string') {
    res.status(403).json({ error: 'Wrong format for templateId' });
    return;
  }

  const result = await prisma.templateParameter.findMany({
    where: { templateId: +templateId },
    include: { type: true },
  });
  res.json(result);
};

export default handle;
