import request from 'supertest';
import { app } from '../../app';

type Ticket = {
	title: string;
	price: number;
};

const createTicket = (ticket: Ticket) => {
	return request(app)
		.post('/api/tickets')
		.set('Cookie', global.signup())
		.send(ticket)
		.expect(201);
};

it('can fetch a list of tickets', async () => {
	const tickets = [
		{ title: 'a cool ticket', price: 20 },
		{ title: 'a cheap ticket', price: 10 },
		{ title: 'an expensive ticket', price: 100 },
	];

	for (const ticket of tickets) {
		await createTicket(ticket);
	}

	const response = await request(app).get('/api/tickets').send().expect(200);

	expect(response.body.length).toEqual(3);
});
