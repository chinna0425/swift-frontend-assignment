import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Loader from "react-loader-spinner";
import "./index.css";

const UserView = () => {
	const [firstUser, setFirstUser] = useState(null);
	useEffect(() => {
		const fetchData = async () => {
			const response = await fetch(
				"https://jsonplaceholder.typicode.com/users"
			);
			const result = await response.json();
			if (response.ok) {
				setFirstUser(result[0]);
			}
		};
		fetchData();
	}, []);
	return (
		<Link to="/profile-screen" className="link-style">
			<div>
				{firstUser !== null ? (
					<h1 className="profile-heading">
						<span className="user-profile-style">
							{firstUser.name
								.split(" ")
								.map((word) => word[0])
								.join("")
								.toUpperCase()}
						</span>{" "}
						{firstUser.name}
					</h1>
				) : (
					<div className="user-loader-container" data-testid="loader">
						<Loader type="Rings" color="#ffff00" height="100" width="100" />
					</div>
				)}
			</div>
		</Link>
	);
};
export default UserView;
