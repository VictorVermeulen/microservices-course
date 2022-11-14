import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

const natsWrapperSpy = jest.spyOn(natsWrapper.client, 'publish');

it('returns an error if the ticket does not exist', async () => {
	const ticketId = new mongoose.Types.ObjectId();

	await request(app)
		.post('/api/orders')
		.set('Cookie', global.signup())
		.send({ ticketId })
		.expect(404);
});

it('returns an error if the ticket is already reserved', async () => {
	const ticket = Ticket.build({
		title: 'concert',
		price: 20,
	});
	await ticket.save();

	const order = Order.build({
		ticket,
		userId: '123abc',
		status: OrderStatus.Created,
		expiresAt: new Date(),
	});
	await order.save();

	await request(app)
		.post('/api/orders')
		.set('Cookie', global.signup())
		.send({ ticketId: ticket.id })
		.expect(400);
});

it('reserves a ticket', async () => {
	const ticket = Ticket.build({
		title: 'concert',
		price: 20,
	});
	await ticket.save();

	await request(app)
		.post('/api/orders')
		.set('Cookie', global.signup())
		.send({ ticketId: ticket.id })
		.expect(201);
});

it('reserves a ticket when someone previously ordered and it got cancelled', async () => {
	const ticket = Ticket.build({
		title: 'concert',
		price: 20,
	});
	await ticket.save();

	const order = Order.build({
		ticket,
		userId: '123abc',
		status: OrderStatus.Cancelled,
		expiresAt: new Date(),
	});
	await order.save();

	await request(app)
		.post('/api/orders')
		.set('Cookie', global.signup())
		.send({ ticketId: ticket.id })
		.expect(201);
});

it('emits an order created event', async () => {
	const ticket = Ticket.build({
		title: 'concert',
		price: 20,
	});
	await ticket.save();

	await request(app)
		.post('/api/orders')
		.set('Cookie', global.signup())
		.send({ ticketId: ticket.id })
		.expect(201);

	expect(natsWrapper.client.publish).toHaveBeenCalled();
	expect(natsWrapperSpy.mock.calls[0][0]).toEqual('order:created');
});
