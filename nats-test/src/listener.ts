import nats, { Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

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

	const options = stan.subscriptionOptions().setManualAckMode(true);

	const subscription = stan.subscribe(
		'ticket:created',
		'ordersServiceQueueGroup',
		options
	);

	subscription.on('message', (msg: Message) => {
		const data = msg.getData();
		if (typeof data === 'string') {
			console.log('🙆‍♂️', `Received event #${msg.getSequence()} with data ${data}`);
		}

		msg.ack();
	});
});

// Does not work on Windows
process.on('SIGINT', () => {
	stan.close();
});

process.on('SIGTERM', () => {
	stan.close();
});
