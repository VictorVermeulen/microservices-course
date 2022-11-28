import { Ticket } from '../ticket';

it('implements optimistic concurrency control', async () => {
	const ticket = Ticket.build({
		title: 'concert',
		price: 5,
		userId: '123',
	});
	await ticket.save();

	const firstInstance = await Ticket.findById(ticket.id);
	const secondInstance = await Ticket.findById(ticket.id);

	firstInstance!.set({ price: 10 });
	secondInstance!.set({ price: 15 });

	await firstInstance!.save();

	expect(async () => {
		await secondInstance!.save();
	}).rejects.toThrow();
});

it('increments version number on multiple saves', async () => {
	const ticket = Ticket.build({
		title: 'concert',
		price: 5,
		userId: '123',
	});
	await ticket.save();
	expect(ticket.version).toEqual(0);

	const firstInstance = await Ticket.findById(ticket.id);
	firstInstance!.set({ price: 10 });
	await firstInstance!.save();
	expect(firstInstance?.version).toEqual(1);

	const secondInstance = await Ticket.findById(ticket.id);
	secondInstance!.set({ price: 15 });
	await secondInstance!.save();
	expect(secondInstance?.version).toEqual(2);

	await secondInstance!.save();
	expect(secondInstance?.version).toEqual(3); // it gets updated after any save
});
