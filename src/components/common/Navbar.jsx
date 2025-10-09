import { Link, matchPath, useLocation } from 'react-router-dom';
import Logo from '../../assets/Logo/Logo-Full-Light.png';
import { NavbarLinks } from '../../data/navbar-links';
import { useSelector } from 'react-redux';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import ProfileDropDown from '../core/Auth/ProfileDropDown';
import { useEffect, useState } from 'react';
import { apiConnector } from '../../services/apiconnector';
import { categories } from '../../services/apis';
import { RiArrowDropDownLine } from 'react-icons/ri';

function Navbar() {
	console.log('printing base url: ', import.meta.env.VITE_BASE_URL);
	const { token } = useSelector((state) => state.auth);
	const { user } = useSelector((state) => state.profile);
	const { totalItems } = useSelector((state) => state.cart);
	const location = useLocation();

	const [subLinks, setSubLinks] = useState([]);
	console.log(subLinks);

	const fetchSublinks = async () => {
		try {
			const result = await apiConnector('GET', categories.CATEGORIES_API);
			console.log('printing sublinks result', result);
			setSubLinks(result.data.data);
		} catch (error) {
			console.log('could not fetch the category list', error);
		}
	};

	useEffect(() => {
		fetchSublinks();
	}, []);

	const matchRoute = (route) => {
		return matchPath({ path: route }, location.pathname);
	};

	return (
		<div className="bg-richblack-900 flex items-center justify-center h-14 border-b border-b-richblack-600">
			<div className="w-10/12 mx-auto max-w-maxContent flex items-center justify-between">
				{/* logo  */}
				<Link to={'/'}>
					<img src={Logo} width={160} height={42} alt="Logo" loading="lazy" className="object-contain" />
				</Link>

				{/* navlinks */}
				<nav>
					<ul className="flex gap-x-4 text-richblack-25">
						{NavbarLinks.map((link, index) => (
							<li key={index}>
								{link.title === 'Catalog' ? (
									<div className="relative group flex items-center">
										<p>{link.title}</p>
										<RiArrowDropDownLine className="size-[20px]" />
										<div className="invisible z-10 absolute left-[50%] translate-x-[-50%] translate-y-[30%] top-[0%] flex flex-col rounded-md bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 lg:w-[300px]">
											<div className="absolute left-[50%] top-[-12px] translate-x-[66%] translate-y-[40%] h-5 w-5 rotate-45 rounded bg-richblack-5"></div>
											{subLinks.length ? (
												subLinks.map((sublink, index) => (
													<Link to={`${sublink?.name}`} key={index}>
														<p>{sublink.name}</p>
													</Link>
												))
											) : (
												<div>empty rake</div>
											)}
										</div>
									</div>
								) : (
									<Link to={link?.path}>
										<p
											className={`${
												matchRoute(link?.path) ? 'text-yellow-25' : 'text-richblack-25'
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

				{/* login signup dashboard */}
				{/* cart icon */}
				<div className="flex gap-x-4 items-center">
					{user && user?.accountType != 'Instructor' && (
						<Link to={'/dashboard/cart'} className="relative">
							<AiOutlineShoppingCart className="text-2xl" />
							{totalItems > 0 && <span>{totalItems}</span>}
						</Link>
					)}

					{/* login */}
					{token === null && (
						<Link to={'/login'}>
							<button className="border border-richblack-700 bg-richblack-800 text-richblack-100 px-[12px] py-[8px] rounded-md">
								Login
							</button>
						</Link>
					)}

					{/* signup */}
					{token === null && (
						<Link to={'/signup'}>
							<button className="border border-richblack-700 bg-richblack-800 text-richblack-100 px-[12px] py-[8px] rounded-md">
								Signup
							</button>
						</Link>
					)}

					{/* dashboard */}
					{token !== null && <ProfileDropDown />}
				</div>
			</div>
		</div>
	);
}
export default Navbar;
