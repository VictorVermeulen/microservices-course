import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns 404 if provided id does not exist', async () => {
	const id = new mongoose.Types.ObjectId().toHexString();
	await request(app)
		.put(`/api/tickets/${id}`)
		.set('Cookie', global.signup())
		.send({ title: 'jlasfd', price: 20 })
		.expect(404);
});
it('returns a 401 if user is not authenticated', async () => {
	const id = new mongoose.Types.ObjectId().toHexString();
	await request(app)
		.put(`/api/tickets/${id}`)
		.send({ title: 'jlasfd', price: 20 })
		.expect(401);
});
it('returns a 401 if user does not own the ticket', async () => {
	const response = await request(app)
		.post(`/api/tickets`)
		.set('Cookie', global.signup())
		.send({ title: 'jlasfd', price: 20 });

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', global.signup())
		.send({ title: 'jgsdfa', price: 10 })
		.expect(401);
});
it('returns a 400 if the user provides an invalid title or price', async () => {
	const cookie = global.signup();

	const response = await request(app)
		.post(`/api/tickets`)
		.set('Cookie', cookie)
		.send({ title: 'jlasfd', price: 20 });

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', cookie)
		.send({ title: '', price: 10 })
		.expect(400);

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', cookie)
		.send({ title: 'titletest', price: -10 })
		.expect(400);
});
it('updates the ticked provided valid inputs', async () => {
	const cookie = global.signup();

	const response = await request(app)
		.post(`/api/tickets`)
		.set('Cookie', cookie)
		.send({ title: 'jlasfd', price: 20 });

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', cookie)
		.send({ title: 'titletest', price: 10 })
		.expect(200);

	const ticketResponse = await request(app)
		.get(`/api/tickets/${response.body.id}`)
		.send();

	expect(ticketResponse.body.title).toEqual('titletest');
	expect(ticketResponse.body.price).toEqual(10);
});
