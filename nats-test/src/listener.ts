import nats, { Message, Stan } from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from './events/ticket-created-listener';

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
	url: 'http://localhost:4222',
});

// @ts-ignore
stan.on('connect', () => {
	console.log('listener connected to NATS');

	stan.on('close', () => {
		console.log('🤛', 'NATS connection closed!');
		process.exit();
	});

	new TicketCreatedListener(stan).listen();
});

// Does not work on Windows
process.on('SIGINT', () => {
	stan.close();
});

process.on('SIGTERM', () => {
	stan.close();
});
