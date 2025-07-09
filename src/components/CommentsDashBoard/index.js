import { Component } from "react";
import { BsSearch } from "react-icons/bs";
import Loader from "react-loader-spinner";
import { FaSort } from "react-icons/fa";
import "./index.css";

const minData = [
	{ id: 1, numberVal: 10, text: "10/page" },
	{ id: 2, numberVal: 50, text: "50/page" },
	{ id: 3, numberVal: 100, text: "100/page" },
];

const dataStatus = {
	success: "SUCCESS",
	initial: "INITIAL",
	failure: "FAILURE",
};

class CommentsDashBoard extends Component {
	// Initial state of the component with default values for comments data, sorting, pagination, and search term

	state = {
		commentsData: [],
		sortConfig: { key: "", direction: null },
		minDataPerPage: minData[0].numberVal,
		currentPage: 1,
		searchTerm: "",
		status: dataStatus.initial,
	};

	// Fetch comments data when the component mounts and set initial state

	componentDidMount() {
		const storedConfig = localStorage.getItem("commentsDashboardConfig");
		if (storedConfig) {
			const parsed = JSON.parse(storedConfig);
			this.setState(
				{
					searchTerm: parsed.searchTerm || "",
					minDataPerPage: parsed.pageSize || 10,
					currentPage: parsed.currentPage || 1,
					sortConfig: {
						key: parsed.sortField || "",
						direction: parsed.sortOrder || null,
					},
				},
				this.getCommentsData
			);
		} else {
			this.getCommentsData();
		}
	}

	// Save the current state to localStorage whenever the component updates

	componentDidUpdate(prevProps, prevState) {
		const { searchTerm, minDataPerPage, currentPage, sortConfig } = this.state;

		const config = {
			searchTerm,
			pageSize: minDataPerPage,
			currentPage,
			sortField: sortConfig.key,
			sortOrder: sortConfig.direction,
		};

		localStorage.setItem("commentsDashboardConfig", JSON.stringify(config));
	}

	// Fetch comments data from the API
	// If the fetch is successful, update the state with the data and set status to success

	getCommentsData = async () => {
		const reponse = await fetch(
			"https://jsonplaceholder.typicode.com/comments"
		);
		const result = await reponse.json();
		if (reponse.ok) {
			this.setState({ commentsData: result, status: dataStatus.success });
		} else {
			this.setState({ status: dataStatus.failure });
		}
	};

	// Handle sorting by updating the sortConfig state based on the column clicked

	onHandleSorting = (columnKey) => {
		this.setState((prevState) => {
			const { sortConfig } = prevState;
			let direction = "asc";

			if (sortConfig.key === columnKey) {
				if (sortConfig.direction === "asc") {
					direction = "desc";
				} else if (sortConfig.direction === "desc") {
					direction = null;
				} else {
					direction = "asc";
				}
			}

			return {
				sortConfig: {
					key: direction ? columnKey : "",
					direction,
				},
			};
		});
	};

	// Handle changes in page size and search term, resetting the current page to 1

	onChangePageSize = (event) => {
		const pageSize = parseInt(event.target.value);
		this.setState({ minDataPerPage: pageSize, currentPage: 1 });
	};

	// Handle changes in the search term, resetting the current page to 1

	onChangeSearchTerm = (event) => {
		this.setState({ searchTerm: event.target.value, currentPage: 1 });
	};

	// Get sorted data based on the current sort configuration
	// If no sorting is applied, return the filtered comments as is

	getSortedData = (filteredComments) => {
		const { sortConfig } = this.state;
		if (!sortConfig.key || !sortConfig.direction) return filteredComments;

		return [...filteredComments].sort((a, b) => {
			const { key, direction } = sortConfig;
			const valA = a[key];
			const valB = b[key];

			if (typeof valA === "string" && typeof valB === "string") {
				const compare = valA.toLowerCase().localeCompare(valB.toLowerCase());
				return direction === "asc" ? compare : -compare;
			}

			if (typeof valA === "number" && typeof valB === "number") {
				return direction === "asc" ? valA - valB : valB - valA;
			}
			return 0;
		});
	};

	// Set the current page to the new page number
	// This function is used for pagination controls to navigate between pages

	setPage = (newPage) => {
		this.setState({ currentPage: newPage });
	};

	// Retry fetching data when the user clicks the retry button
	// Reset the state to initial values and call getCommentsData to fetch data again

	onRetryData = () => {
		this.setState(
			{
				status: dataStatus.initial,
				sortConfig: { key: "", direction: null },
				searchTerm: "",
			},
			this.getCommentsData
		);
	};

	// Render pagination controls based on the total number of pages
	// It shows buttons for navigating to the first, previous, next, and last pages,

	renderPaginationControls = (totalPages) => {
		const { currentPage } = this.state;
		const visiblePages = [currentPage, currentPage + 1].filter(
			(p) => p <= totalPages
		);

		return (
			<div className="pagination-controls">
				<button
					type="button"
					onClick={() => this.setPage(1)}
					disabled={currentPage === 1}
				>
					«
				</button>
				<button
					type="button"
					onClick={() => this.setPage(currentPage - 1)}
					disabled={currentPage === 1}
				>
					‹
				</button>

				{visiblePages.map((page) => (
					<button
						type="button"
						key={page}
						onClick={() => this.setPage(page)}
						className={page === currentPage ? "active-page" : ""}
					>
						{page}
					</button>
				))}

				<button
					type="button"
					onClick={() => this.setPage(currentPage + 1)}
					disabled={currentPage >= totalPages}
				>
					›
				</button>
				<button
					type="button"
					onClick={() => this.setPage(totalPages)}
					disabled={currentPage >= totalPages}
				>
					»
				</button>
			</div>
		);
	};

	// Render different views based on the status of data fetching
	// If data is being loaded, show a loader

	onDataFailure = () => (
		<div className="comments-failure-view">
			<img
				src="https://www.digitalmesh.com/blog/wp-content/uploads/2020/05/404-error.jpg"
				alt="no-data"
				className="no-data-image"
			/>
			<h1 className="not-fond-title">The Data NotFound</h1>
			<p className="not-found-desc">Please Reload once again.</p>
			<button
				type="button"
				className="retry-button-style"
				onClick={this.onRetryData}
			>
				Retry
			</button>
		</div>
	);

	// Show a loader while data is being fetched

	onLoadingData = () => (
		<div className="comments-loader-container" data-testid="loader">
			<Loader type="Bars" color="#F7931E" height="50" width="50" />
		</div>
	);

	// Render the success view with the comments data in a table format
	// It includes pagination controls and a search input to filter comments

	onDataSuccess = () => {
		const { commentsData, minDataPerPage, currentPage, searchTerm } =
			this.state;
		const filteredComments = commentsData.filter(
			(item) =>
				item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
				item.body.toLowerCase().includes(searchTerm.toLowerCase())
		);

		const sortingData = this.getSortedData(filteredComments);
		const totalPages = Math.ceil(sortingData.length / minDataPerPage);
		const startIndex = (currentPage - 1) * minDataPerPage;
		const endIndex = startIndex + minDataPerPage;
		const slicedData = sortingData.slice(startIndex, endIndex);
		return (
			<>
				{slicedData.length > 0 ? (
					<>
						<table className="table-styling">
							<thead>
								<tr className="table-heading">
									<th>PostId</th>
									<th>Name</th>
									<th>Email</th>
									<th>Comment</th>
								</tr>
							</thead>
							<tbody>
								{slicedData.map((each) => (
									<tr key={each.id} className="cell-style">
										<td>{each.postId}</td>
										<td>{each.name}</td>
										<td>{each.email}</td>
										<td>{each.body.slice(0, each.body.length / 4)}...</td>
									</tr>
								))}
							</tbody>
						</table>
						<div className="filtering-container">
							<h1 className="filtering-heading">
								{startIndex + 1} - {Math.min(endIndex, sortingData.length)} of{" "}
								{sortingData.length}
							</h1>
							{this.renderPaginationControls(totalPages)}
							<select
								className="sorting-select-options"
								value={minDataPerPage}
								onChange={this.onChangePageSize}
							>
								{minData.map((each) => (
									<option key={each.id} value={each.numberVal}>
										{each.text}
									</option>
								))}
							</select>
						</div>
					</>
				) : (
					<div className="comments-failure-view">
						<img
							src="https://img.freepik.com/free-vector/no-data-concept-illustration_114360-536.jpg?size=626&ext=jpg&ga=GA1.1.279979557.1694026057&semt=ais"
							alt="no-data"
							className="no-data-image"
						/>
						<h1 className="not-fond-title">No Search Results</h1>
						<p className="not-found-desc">Try with new search text.</p>
						<button
							type="button"
							className="retry-button-style"
							onClick={this.onRetryData}
						>
							Retry
						</button>
					</div>
				)}
			</>
		);
	};

	// Handle data fetching based on the current status
	// If the status is success, render the success view

	onDataFetch = () => {
		const { status } = this.state;
		switch (status) {
			case dataStatus.success:
				return this.onDataSuccess();
			case dataStatus.failure:
				return this.onDataFailure();
			default:
				return this.onLoadingData();
		}
	};

	render() {
		const { searchTerm } = this.state;
		return (
			<div className="comments-main-container">
				<div className="comments-inner-container">
					<div className="sortings-search-container">
						<div className="sorting-button-container">
							<button
								type="button"
								onClick={() => this.onHandleSorting("postId")}
							>
								Sort PostId <FaSort size={18} style={{ marginLeft: "10px" }} />
							</button>
							<button
								type="button"
								onClick={() => this.onHandleSorting("name")}
							>
								Sort Name <FaSort size={18} style={{ marginLeft: "10px" }} />
							</button>
							<button
								type="button"
								onClick={() => this.onHandleSorting("email")}
							>
								Sort Email <FaSort size={18} style={{ marginLeft: "10px" }} />
							</button>
						</div>
						<div className="search-container">
							<BsSearch size={25} style={{ marginLeft: "5px" }} />
							<input
								type="search"
								placeholder="Search name, email, comment"
								className="search-input"
								value={searchTerm}
								onChange={this.onChangeSearchTerm}
							/>
						</div>
					</div>
					<div className="table-container">{this.onDataFetch()}</div>
				</div>
			</div>
		);
	}
}

export default CommentsDashBoard;
