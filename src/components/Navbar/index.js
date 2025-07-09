import { Link } from "react-router-dom";
import UserView from "../UserView";
import "./index.css";

const Navbar = () => (
	<nav className="navbar">
		<div className="logo-profile-container">
			<Link to="/" className="link-style">
				<img
					src="https://cdn.prod.website-files.com/6509887b9119507025235a5a/650ada40fd6cf3427547c9d8_Swift%20logo.svg"
					alt="swift-logo"
				/>
			</Link>
			<UserView />
		</div>
	</nav>
);

export default Navbar;
