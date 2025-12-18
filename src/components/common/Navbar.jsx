import { Link, matchPath, useLocation } from 'react-router-dom';
import Logo from '../../assets/Logo/Logo-Full-Light.png';
import { NavbarLinks } from '../../data/navbar-links';
import { useSelector } from 'react-redux';
import { AiOutlineMenu, AiOutlineClose, AiOutlineShoppingCart } from 'react-icons/ai';
import { useEffect, useState } from 'react';
import { apiConnector } from '../../services/apiConnector';
import { categories } from '../../services/apis';
import { RiArrowDropDownLine } from 'react-icons/ri';
import { ACCOUNT_TYPE } from '../../utils/constants';
import ProfileDropDown from '../core/Auth/ProfileDropDown';

function Navbar() {
	const { token } = useSelector((state) => state.auth);
	const { user } = useSelector((state) => state.profile);
	const { totalItems } = useSelector((state) => state.cart);
	const location = useLocation();

	const [subLinks, setSubLinks] = useState([]);
	const [loading, setLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	// Fetch category sublinks
	const fetchSublinks = async () => {
		setLoading(true);
		try {
			const result = await apiConnector('GET', categories.CATEGORIES_API);
			setSubLinks(result.data.data);
		} catch (error) {
			console.log('Could not fetch category list', error);
		}
		setLoading(false);
	};

	useEffect(() => {
		fetchSublinks();
	}, []);

	const matchRoute = (route) => matchPath({ path: route }, location.pathname);

	// Close mobile menu on route change
	useEffect(() => {
		setIsOpen(false);
	}, [location.pathname]);

	return (
		<div className="bg-richblack-900 flex items-center justify-center h-14 border-b border-b-richblack-600 relative">
			<div className="w-10/12 mx-auto max-w-maxContent flex items-center justify-between navbar-container">
				{/* Logo */}
				<Link to="/">
					<img src={Logo} width={160} height={42} alt="Logo" loading="lazy" className="object-contain" />
				</Link>

				{/* Desktop Navlinks */}
				<nav className="hidden md:block">
					<ul className="flex gap-x-6 text-richblack-25">
						{NavbarLinks.map((link, index) => (
							<li key={index}>
								{link.title === 'Catalog' ? (
									<div
										className={`group relative flex cursor-pointer items-center gap-1 ${
											matchRoute('/catalog/:catalogName')
												? 'text-yellow-25'
												: 'text-richblack-25'
										}`}
									>
										<p>{link.title}</p>
										<RiArrowDropDownLine />
										<div className="invisible absolute left-[50%] top-[50%] z-1000 flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-2 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
											<div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
											{loading ? (
												<div className="flex items-center justify-center w-full h-screen">
													<div className="loader"></div>
												</div>
											) : subLinks.length ? (
												subLinks.map((subLink, i) => (
													<Link
														key={i}
														to={`/catalog/${subLink.name
															.split(' ')
															.join('-')
															.toLowerCase()}`}
														className="rounded-lg bg-transparent py-2 pl-2 hover:bg-richblack-50"
													>
														<p className="font-semibold text-richblack-700">
															{subLink.name}
														</p>
													</Link>
												))
											) : (
												<p className="text-center">No Courses Found</p>
											)}
										</div>
									</div>
								) : (
									<Link to={link.path}>
										<p
											className={`${
												matchRoute(link.path) ? 'text-yellow-25' : 'text-richblack-25'
											}`}
										>
											{link.title}
										</p>
									</Link>
								)}
							</li>
						))}
					</ul>
				</nav>

				{/* Desktop Buttons */}
				<div className="hidden md:flex items-center gap-x-4">
					{user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
						<Link to="/dashboard/cart" className="relative">
							<AiOutlineShoppingCart className="text-2xl text-richblack-100" />
							{totalItems > 0 && (
								<span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
									{totalItems}
								</span>
							)}
						</Link>
					)}
					{token === null && (
						<>
							<Link to="/login">
								<button className="rounded-lg border cursor-pointer border-richblack-700 bg-richblack-800 px-3 py-2 text-richblack-100">
									Log in
								</button>
							</Link>
							<Link to="/signup">
								<button className="rounded-lg cursor-pointer border border-richblack-700 bg-richblack-800 px-3 py-2 text-richblack-100">
									Sign up
								</button>
							</Link>
						</>
					)}
					{token !== null && <ProfileDropDown />}
				</div>

				{/* Mobile Menu Toggle */}
				<button className="md:hidden text-richblack-25" onClick={() => setIsOpen((prev) => !prev)}>
					{isOpen ? <AiOutlineClose fontSize={26} /> : <AiOutlineMenu fontSize={26} />}
				</button>
			</div>

			{/* Mobile Menu Drawer */}
			{isOpen && (
				<div className="absolute top-14 left-0 w-full bg-richblack-900 border-t border-richblack-700 flex flex-col items-start p-5 gap-y-4 z-50 md:hidden transition-all duration-300">
					<ul className="flex flex-col gap-y-3 w-full items-center text-richblack-25">
						{NavbarLinks.map((link, index) => (
							<li key={index}>
								{link.title === 'Catalog' ? (
									<details className="group">
										<summary className="flex items-center gap-1 cursor-pointer">
											{link.title}
											<RiArrowDropDownLine />
										</summary>
										<div className="flex flex-col gap-2 pl-4 mt-2">
											{subLinks.map((subLink, i) => (
												<Link
													key={i}
													to={`/catalog/${subLink.name
														.split(' ')
														.join('-')
														.toLowerCase()}`}
													className="text-sm hover:text-yellow-25"
												>
													{subLink.name}
												</Link>
											))}
										</div>
									</details>
								) : (
									<Link
										to={link.path}
										className={`${
											matchRoute(link.path) ? 'text-yellow-25' : 'text-richblack-25'
										}`}
									>
										{link.title}
									</Link>
								)}
							</li>
						))}
					</ul>

					<div className="flex flex-col gap-y-3 mt-4 w-full">
						{user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
							<Link to="/dashboard/cart" className="flex items-center gap-2">
								<AiOutlineShoppingCart className="text-xl" />
								<span>Cart ({totalItems})</span>
							</Link>
						)}
						{token === null ? (
							<>
								<Link to="/login">
									<button className="w-full border border-richblack-700 bg-richblack-800 py-2 text-richblack-100 rounded-md">
										Log in
									</button>
								</Link>
								<Link to="/signup">
									<button className="w-full border border-richblack-700 bg-richblack-800 py-2 text-richblack-100 rounded-md">
										Sign up
									</button>
								</Link>
							</>
						) : (
							<ProfileDropDown />
						)}
					</div>
				</div>
			)}
		</div>
	);
}

export default Navbar;
