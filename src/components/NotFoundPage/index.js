import { Link } from "react-router-dom";
import "./index.css";

const NotFoundPage = () => (
	<div className="not-found-page-container">
		<img
			src="https://res.cloudinary.com/chinna25/image/upload/v1694067333/Group_1_f33dke.png"
			alt="not-found"
			className="not-found-image"
		/>
		<h1 className="not-found-title">Page Not Found</h1>
		<p className="not-found-para">
			We are sorry,the page you requested could not be found.
		</p>
		<p className="not-found-para">Please go back to the comments dashboard.</p>
		<Link to="/">
			<button type="button" className="not-found-button-style">
				Go To Comments Dashboard
			</button>
		</Link>
	</div>
);
export default NotFoundPage;
