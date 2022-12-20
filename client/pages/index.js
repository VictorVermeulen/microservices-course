import Link from 'next/link';

const LandingPage = ({ currentUser, tickets }) => {
	const ticketList = tickets.map((ticket) => {
		return (
			<tr key={ticket.id}>
				<td>{ticket.title}</td>
				<td>{ticket.price}</td>
				<td>
					<Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
						<a>View</a>
					</Link>
				</td>
			</tr>
		);
	});

	return (
		<div className="d-grid gap 3">
			<h1 className="p-2">Tickets</h1>
			<table className="table">
				<thead>
					<tr>
						<th>Title</th>
						<th>Price</th>
						<th>Link</th>
					</tr>
				</thead>
				<tbody>{ticketList}</tbody>
			</table>
		</div>
	);
};

// This is to execute some code on the server when url gets called, it's rendered once and that's sent to user.
// After user sees the component, component can do it's work.
// This is executed during server side rendering process, client won't see this
LandingPage.getInitialProps = async (context, client, currentUser) => {
	const { data } = await client.get('/api/tickets');

	return { tickets: data };
};

export default LandingPage;
