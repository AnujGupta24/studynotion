import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CiShare1 } from 'react-icons/ci';
import copy from 'copy-to-clipboard';
import { toast } from 'react-hot-toast';
import { ACCOUNT_TYPE } from '../../../utils/constants';
import { addToCart } from '../../../slices/cartSlice';

const CourseDetailsCard = ({ course, setConfirmationModal, handleBuyCourse }) => {
	console.log('courseDetailscard.....', course);
	const { thumbnail, price } = course;

	const { user } = useSelector((state) => state.profile);
	const { token } = useSelector((state) => state.auth);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleAddToCart = () => {
		// if instructor
		if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
			toast.error('Instructor can not add course to cart');
			return;
		}

		// if student
		if (token) {
			dispatch(addToCart(course));
			return;
		}
		setConfirmationModal({
			text1: 'You are not Logged In',
			text2: 'Please login to add course to cart',
			btn1Text: 'Login',
			bnt2Text: 'Cancel',
			btn1Handler: () => navigate('/login'),
			btn2Handler: () => setConfirmationModal(null),
		});
	};

	const handleShare = () => {
		copy(window.location.href);
		toast.success('Link copied to clipboard');
	};

	return (
		<div className={`flex flex-col gap-4 rounded-md bg-richblack-700 p-4 text-richblack-5`}>
			<img
				src={thumbnail}
				alt={'thumbnail image'}
				className="max-h-[300px] min-h-[150px] w-[400px] rounded-xl"
			/>
			<p>Rs. {price}</p>
			<div className="flex flex-col gap-2">
				<button
					className="yellowButton"
					onClick={
						user && course?.studentsEnrolled.includes(user?._id)
							? () => navigate(`/dashboard/enrolled-courses`)
							: handleBuyCourse
					}
				>
					{user && course?.studentsEnrolled.includes(user?._id) ? 'Go to Course' : 'Buy Now'}
				</button>

				{/* show only when student is not enrolled */}
				{!course?.studentsEnrolled.includes(user?._id) && (
					<button className="blackButton" onClick={handleAddToCart}>
						Add to Cart
					</button>
				)}
			</div>

			<div>
				<p>30 Day money back guarantee</p>
				<p>This Course Includes:</p>
				{console.log('HEUY: ', JSON.parse(course?.instructions))}
				<div>
					{JSON.parse(course?.instructions).map((instruction, i) => (
						<p key={i} className="flex gap-2">
							<span>{instruction}</span>
						</p>
					))}
				</div>
			</div>

			<div className="mx-auto flex items-center gap-2 p-6 text-yellow-50">
				<button onClick={handleShare} className="flex items-center gap-2">
					<CiShare1 />
					Share
				</button>
			</div>
		</div>
	);
};
export default CourseDetailsCard;
