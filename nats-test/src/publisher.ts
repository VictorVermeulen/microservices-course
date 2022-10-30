import nats from 'node-nats-streaming';

console.clear();

const stan = nats.connect('ticketing', 'abc', {
	url: 'http://localhost:4222',
});

// @ts-ignore
stan.on('connect', () => {
	console.log('publisher connected to NATS');

	const data = JSON.stringify({
		id: '123',
		title: 'concert',
		price: 20,
	}); // this is often referred to as a message in documentation

	stan.publish('ticket:created', data, () => {
		console.log('🤟', 'ticket event created');
	});
});
