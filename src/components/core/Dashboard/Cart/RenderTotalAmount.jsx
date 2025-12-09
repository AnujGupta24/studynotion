import { useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
import IconBtn from '../../../common/IconBtn';

function RenderTotalAmount() {
	const { total, cart } = useSelector((state) => state.cart);
	// const { token } = useSelector((state) => state.auth);
	// const { user } = useSelector((state) => state.profile);
	// const navigate = useNavigate();
	// const dispatch = useDispatch();

	const handleBuyCourse = () => {
		// took the course id which we wwant to buy
		const courses = cart.map((course) => course._id);
		// 	BuyCourse(token, courses, user, navigate, dispatch);
		console.log('bought these courses', courses);
		// todo : api integration payment gateway
	};
	return (
		<div className="min-w-[280px] rounded-md border border-richblack-700 bg-richblack-800 p-6">
			<p className="mb-1 text-sm font-medium text-richblack-300">Total:</p>
			<p className="mb-6 text-3xl font-medium text-yellow-100">₹ {total}</p>
			<IconBtn text="Buy Now" onclick={handleBuyCourse} customClasses="w-full justify-center" />
		</div>
	);
}
export default RenderTotalAmount;
