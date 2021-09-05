// import prisma from '@/lib/prisma';
import stripe from '@/lib/stripe';
import { NextApiHandler } from 'next';

const handle: NextApiHandler = async (_, res) => {
  const prices = await stripe.prices.list();

  if (prices) {
    const plans = await Promise.all(
      prices.data.map(async (price) => {
        if (typeof price.product !== 'string') return null;
        const product = await stripe.products.retrieve(price.product);
        return { product, price };
      })
    );
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate');
    return res
      .status(200)
      .json(
        plans.sort(
          (a, b) => (a?.price.unit_amount || 0) - (b?.price.unit_amount || 0)
        )
      );
  }
  return res.status(404).json({ error: 'Not Found' });
};

export default handle;
