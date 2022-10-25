import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

// TODO: write this test to show a ticket based on ID
it('returns a 404 if ticket is not found', async () => {
	const id = new mongoose.Types.ObjectId().toHexString();
	await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it('returns the ticktet if the ticket is found', async () => {
	const title = 'a very cool ticket';
	const price = 20;

	const response = await request(app)
		.post('/api/tickets')
		.set('Cookie', global.signup())
		.send({
			title,
			price,
		})
		.expect(201);

	const { id } = response.body;

	const ticketResponse = await request(app)
		.get(`/api/tickets/${id}`)
		.send()
		.expect(200);

	expect(ticketResponse.body.title).toEqual(title);
	expect(ticketResponse.body.price).toEqual(price);
});
