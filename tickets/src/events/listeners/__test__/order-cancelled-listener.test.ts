import mongoose from 'mongoose';
import { OrderCancelledEvent, OrderStatus } from '@vvtickets/common';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCancelledListener } from '../order-cancelled-listener';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
	const listener = new OrderCancelledListener(natsWrapper.client);

	const ticket = Ticket.build({
		title: 'concert',
		price: 20,
		userId: 'testuserid',
	});
	ticket.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
	await ticket.save();

	const data: OrderCancelledEvent['data'] = {
		id: new mongoose.Types.ObjectId().toHexString(),
		version: 0,
		ticket: {
			id: ticket.id,
		},
	};

	// @ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	};

	return { listener, ticket, data, msg };
};

it('updates the ticket, publishes an event, and acks the message', async () => {
	const { listener, ticket, data, msg } = await setup();

	await listener.onMessage(data, msg);

	const updatedTicket = await Ticket.findById(ticket.id);

	expect(updatedTicket!.orderId).toBeUndefined();
	expect(msg.ack).toHaveBeenCalled();
	expect(natsWrapper.client.publish).toHaveBeenCalled();
});
