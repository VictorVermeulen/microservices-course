import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';
import jwt from 'jsonwebtoken';

declare global {
	var signup: () => string[];
}

let mongo: any;
beforeAll(async () => {
	process.env.JWT_KEY = 'asflkjasdf';

	mongo = await MongoMemoryServer.create();
	const mongoUri = await mongo.getUri();

	await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
	const collections = await mongoose.connection.db.collections();

	for (let collection of collections) {
		await collection.deleteMany({});
	}
});

afterAll(async () => {
	if (mongo) {
		await mongo.stop();
	}
	await mongoose.connection.close();
});

global.signup = () => {
	const payload = {
		id: 'lasfdj123s',
		email: 'test@test.com',
	};
	const token = jwt.sign(payload, process.env.JWT_KEY!);

	const session = { jwt: token };

	const sessionJSON = JSON.stringify(session);

	const base64 = Buffer.from(sessionJSON).toString('base64');

	return [`session=${base64}`];
};