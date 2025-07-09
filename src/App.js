import { Switch, Route, Redirect } from "react-router-dom";
import CommentsDashBoard from "./components/CommentsDashBoard";
import Navbar from "./components/Navbar";
import ProfileScreen from "./components/ProfileScreen";
import NotFoundPage from "./components/NotFoundPage";
import "./App.css";

const App = () => (
	<>
		<Navbar />
		<Switch>
			<Route exact path="/" component={CommentsDashBoard} />
			<Route exact path="/profile-screen" component={ProfileScreen} />
			<Route exact path="/not-found" component={NotFoundPage} />
			<Redirect to="/not-found" />
		</Switch>
	</>
);

export default App;
