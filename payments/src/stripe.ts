import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

export const stripe = new Stripe(process.env.STRIPE_KEY!, {
	// @ts-ignore
	apiVersion: '2020-03-02',
});
