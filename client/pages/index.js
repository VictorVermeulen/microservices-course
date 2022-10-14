const LandingPage = ({ color }) => {
	console.log('😡', 'I am in the component', color);
	return <h1>Landing Page</h1>;
};

// This is to execute some code on the server when url gets called, it's rendered once and that's sent to user.
// After user sees the component, component can do it's work.
// This is executed during server side rendering process, client won't see this
LandingPage.getInitialProps = () => {
	console.log('👹', 'I am on the server!');

	// This can be used as prop inside component now
	return { color: 'red' };
};

export default LandingPage;
