import Stripe from 'stripe';

export type Plan = { product: Stripe.Product; price: Stripe.Price };
