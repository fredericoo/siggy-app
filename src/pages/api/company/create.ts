import { NextApiHandler } from 'next'
import { getSession } from 'next-auth/client'
import prisma from '@/lib/prisma'

const handle: NextApiHandler = async (req, res) => {
  const { title, domain, planId } = req.body

  const session = await getSession({ req })
  if (!session?.id || typeof session.id !== 'number') {
    res.status(401).json({
      message: 'Unauthorized',
    })
    return
  }
  const result = await prisma.company.create({
    data: {
      title,
      domain,
      plan: { connect: { id: planId } },
      admin: { connect: { id: session?.id } },
    },
  })
  res.json(result)
}

export default handle
