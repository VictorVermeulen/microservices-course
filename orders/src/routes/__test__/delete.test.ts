import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';

it('marks an order as cancelled', async () => {
	// create a ticket

	const ticket = Ticket.build({
		title: 'concert',
		price: 20,
	});
	await ticket.save();

	const user = global.signup();
	// make request to create order
	const { body: order } = await request(app)
		.post('/api/orders')
		.set('Cookie', user)
		.send({ ticketId: ticket.id })
		.expect(201);

	// make request to cancel order
	await request(app)
		.delete(`/api/orders/${order.id}`)
		.set('Cookie', user)
		.expect(204);

	// expect make sure thing is cancelled
	const { body: orderCancelled } = await request(app)
		.get(`/api/orders/${order.id}`)
		.set('Cookie', user)
		.send({ ticketId: ticket.id })
		.expect(200);

	expect(orderCancelled.status).toEqual(OrderStatus.Cancelled);
});

it.todo('emits an order cancelled event');
