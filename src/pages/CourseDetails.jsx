import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { buyCourse } from '../services/operations/studentFeaturesApi';

function CourseDetails() {
	const { user } = useSelector((state) => state.profile);
	const { token } = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { courseId } = useParams();

	const handleBuyCourse = () => {
		if (token) {
			buyCourse(token, [courseId], user, navigate, dispatch);
			return;
		}
	};

	return (
		<div className="flex flex-col gap-4 border-y border-y-richblack-500 py-4">
			<p className="space-x-3 pb-4 text-3xl font-semibold text-richblack-5">Rs</p>
			<button className="yellowButton" onClick={handleBuyCourse}>
				Buy Now
			</button>
		</div>
	);
}
export default CourseDetails;
