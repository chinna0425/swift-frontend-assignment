import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Loader from "react-loader-spinner";
import "./index.css";

const ProfileScreen = () => {
	const [firstUser, setFirstUser] = useState(null);

	// fetching first userdata

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
		<>
			{firstUser === null ? (
				<div className="loader-container" data-testid="loader">
					<Loader type="Rings" color="#ffff00" height="100" width="100" />
				</div>
			) : (
				<div className="profile-screen-container">
					<div className="profile-screen-inner-container">
						<div className="welcome-container">
							<Link to="/" className="profile-link-style">
								<FaArrowLeft className="left-arrow" />
							</Link>
							<h1 className="profile-name-title">Welcome, {firstUser.name}</h1>
						</div>
						<div className="profile-info-container">
							<div className="profile-dp-format">
								<div className="dp-logo-style">
									{firstUser.name
										.split(" ")
										.map((word) => word[0])
										.join("")
										.toUpperCase()}
								</div>
								<div className="profile-text-container">
									<h1 className="profile-title">{firstUser.name}</h1>
									<p className="profile-desc">{firstUser.email}</p>
								</div>
							</div>
							<div className="user-name-container">
								<div className="field-set">
									<label htmlFor="userid" className="label-text">
										User Id
									</label>
									<br />
									<input
										className="profile-input-field"
										type="text"
										value={firstUser.id}
										disabled
										name="userid"
									/>
								</div>
								<div className="field-set">
									<label htmlFor="name" className="label-text">
										Name
									</label>
									<br />
									<input
										type="text"
										value={firstUser.name}
										disabled
										className="profile-input-field"
										name="name"
									/>
								</div>
							</div>
							<div className="email-address-container">
								<div className="field-set">
									<label htmlFor="emailid" className="label-text">
										Email Id
									</label>
									<br />
									<input
										type="text"
										value={firstUser.email}
										disabled
										className="profile-input-field"
										name="emailid"
									/>
								</div>
								<div className="field-set">
									<label htmlFor="address" className="label-text">
										Address
									</label>
									<br />
									<input
										type="text"
										value={`${firstUser.address.street}, ${firstUser.address.city}`}
										disabled
										className="profile-input-field"
										name="address"
									/>
								</div>
							</div>
							<div className="phone-container">
								<div className="field-set">
									<label htmlFor="phonenumber" className="label-text">
										Phone{" "}
									</label>
									<br />
									<input
										className="profile-input-field"
										type="text"
										value={firstUser.phone}
										disabled
										name="userid"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};
export default ProfileScreen;
