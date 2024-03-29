import request from 'supertest';
import mongoose from 'mongoose';
import { OrderStatus } from '@vvtickets/common';

import { app } from '../../app';
import { Order } from '../../models/order';
import { stripe } from '../../stripe';
import { Payment } from '../../models/payment';

it('returns a 404 when purchasing an order that does not exist', async () => {
	await request(app)
		.post('/api/payments')
		.set('Cookie', global.signup())
		.send({
			token: 'abc',
			orderId: new mongoose.Types.ObjectId().toHexString(),
		})
		.expect(404);
});
it('returns a 401 when purchasing an order that does not belong to the user', async () => {
	const order = Order.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		version: 0,
		userId: new mongoose.Types.ObjectId().toHexString(),
		price: 20,
		status: OrderStatus.Created,
	});

	await order.save();

	await request(app)
		.post('/api/payments')
		.set('Cookie', global.signup())
		.send({
			token: 'abc',
			orderId: order.id,
		})
		.expect(401);
});
it('returns a 400 when purchasing an order that is cancelled', async () => {
	const userId = new mongoose.Types.ObjectId().toHexString();

	const order = Order.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		version: 0,
		userId,
		price: 20,
		status: OrderStatus.Cancelled,
	});

	await order.save();

	await request(app)
		.post('/api/payments')
		.set('Cookie', global.signup(userId))
		.send({
			token: 'abc',
			orderId: order.id,
		})
		.expect(400);
});

it('returns a 201 with valid inputs', async () => {
	const userId = new mongoose.Types.ObjectId().toHexString();
	const price = Math.floor(Math.random() * 100000);
	const order = Order.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		version: 0,
		userId,
		price,
		status: OrderStatus.Created,
	});

	await order.save();
	await request(app)
		.post('/api/payments')
		.set('Cookie', global.signup(userId))
		.send({
			token: 'tok_visa',
			orderId: order.id,
		})
		.expect(201);
	const stripeCharges = await stripe.charges.list({ limit: 3 });
	const stripeCharge = stripeCharges.data.find(
		(item) => item.amount === price * 100
	);

	expect(stripeCharge).toBeDefined();

	const payment = await Payment.findOne({
		orderId: order.id,
		stripeId: stripeCharge!.id,
	});

	expect(payment).not.toBeNull();
});
