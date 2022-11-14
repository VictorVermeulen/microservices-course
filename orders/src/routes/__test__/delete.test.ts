import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

const natsWrapperSpy = jest.spyOn(natsWrapper.client, 'publish');

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

it('emits an order cancelled event', async () => {
	const ticket = Ticket.build({ title: 'Concert', price: 20 });
	await ticket.save();

	const user = global.signup();

	const { body: order } = await request(app)
		.post('/api/orders')
		.set('Cookie', user)
		.send({ ticketId: ticket.id })
		.expect(201);

	await request(app)
		.delete(`/api/orders/${order.id}`)
		.set('Cookie', user)
		.send()
		.expect(204);

	expect(natsWrapper.client.publish).toHaveBeenCalledTimes(2);
	expect(natsWrapperSpy.mock.calls[1][0]).toEqual('order:cancelled');
});
