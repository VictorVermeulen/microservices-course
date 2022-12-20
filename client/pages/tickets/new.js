import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/useRequest';

const NewTicket = () => {
	const [title, setTitle] = useState('');
	const [price, setPrice] = useState('');
	const { doRequest, errors } = useRequest({
		url: '/api/tickets',
		method: 'post',
		body: {
			title,
			price,
		},
		onSuccess: () => Router.push('/'),
	});

	const onSubmit = (event) => {
		event.preventDefault();

		doRequest();
	};

	const onBlur = () => {
		const value = parseFloat(price);

		if (isNaN(value)) {
			return;
		}

		setPrice(value.toFixed(2));
	};

	return (
		<div className="d-grid gap 3">
			<h1 className="p-2">Create a Ticket</h1>
			<form onSubmit={onSubmit}>
				<div className="form-group p-2">
					<label>Title</label>
					<input
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						className="form-control p-2"
						type="text"
					/>
				</div>
				<div className="form-group p-2">
					<label>Price</label>
					<input
						value={price}
						onBlur={onBlur}
						onChange={(e) => setPrice(e.target.value)}
						className="form-control p-2"
						type="text"
					/>
				</div>
				<div className="p-2">
					{errors}
					<button className="btn btn-primary">Submit</button>
				</div>
			</form>
		</div>
	);
};

export default NewTicket;
