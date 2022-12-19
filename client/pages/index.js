const LandingPage = ({ currentUser }) => {
	console.log('😡', currentUser);
	// axios.get('/api/users/currentuser').catch((error) => console.log(error));

	return currentUser ? (
		<h1>You are signed in</h1>
	) : (
		<h1>You are not signed in</h1>
	);
};

// This is to execute some code on the server when url gets called, it's rendered once and that's sent to user.
// After user sees the component, component can do it's work.
// This is executed during server side rendering process, client won't see this
LandingPage.getInitialProps = async (context, client, currentUser) => {
	return {};
};

export default LandingPage;
