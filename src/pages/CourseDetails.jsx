import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { buyCourse } from '../services/operations/studentFeaturesApi';
import { useEffect, useState } from 'react';
import { fetchCourseDetails } from '../services/operations/courseDetailsApi';
import GetAvgRating from '../utils/avgRating';
import Error from './Error';
import ConfirmationModal from '../components/common/ConfirmationModal';
import RatingStars from '../components/common/RatingStars';
import formattedDate from '../utils/dateFormatter';
import Footer from '../components/common/Footer';
import { CiGlobe } from 'react-icons/ci';
import CourseDetailsCard from '../components/core/Course/CourseDetailsCard';
import ReactMarkDown from 'react-markdown';

import { BiInfoCircle } from 'react-icons/bi';
import CourseAccordionBar from '../components/core/Course/CourseAccordianBar';

// function starts 
function CourseDetails() {
	const { user } = useSelector((state) => state.profile);
	const { token } = useSelector((state) => state.auth);
	const { loading } = useSelector((state) => state.profile);
	const { paymentLoading } = useSelector((state) => state.course);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { courseId } = useParams();

	// get full course data
	const [courseData, setCourseData] = useState(null);
	const [confirmationModal, setConfirmationModal] = useState(null);

	useEffect(() => {
		const getFullCourseDetails = async () => {
			try {
				const response = await fetchCourseDetails(courseId);
				setCourseData(response);
			} catch (error) {
				console.log('could not fetch course details' + error.message);
			}
		};
		getFullCourseDetails();
	}, [courseId]);

	// get avgratingcount
	const [avgRatingCount, setAvgRatingCount] = useState(0);
	useEffect(() => {
		const count = GetAvgRating(courseData?.data?.courseDetails?.ratingAndReviews);
		setAvgRatingCount(count);
	}, [courseData]);

	// console.log('courseData', courseData);

	// get  totalNoOfLectures
	const [totalNoOfLectures, setTotalNoOfLectures] = useState(0);
	useEffect(() => {
		let lectureCount = 0;
		courseData?.data?.courseContent?.forEach((sec) => {
			lectureCount += sec?.subSection?.length || 0;
		});
		setTotalNoOfLectures(lectureCount);
	}, [courseData]);

	// collapse all section
	const [isActive, setIsActive] = useState([]);
	const handleActive = (id) => {
		setIsActive(
			!isActive.includes(id) ? isActive.concat([id]) : isActive.filter((activeId) => activeId !== id)
		);
	};

	const handleBuyCourse = () => {
		if (token) {
			buyCourse(token, [courseId], user, navigate, dispatch);
			return;
		}
		setConfirmationModal({
			text1: 'You are not Logged In',
			text2: 'Please login to purchase the course',
			btn1Text: 'Login',
			bnt2Text: 'Cancel',
			btn1Handler: () => navigate('/login'),
			btn2Handler: () => setConfirmationModal(null),
		});
	};

	if (loading || paymentLoading || !courseData) {
		return (
			<div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
				<div className="loader"></div>
			</div>
		);
	}

	if (!courseData?.success) {
		return (
			<div className="">
				<Error />
			</div>
		);
	}

	const {
		courseName,
		courseDescription,
		thumbnail,
		price,
		whatYouWillLearn,
		courseContent,
		ratingAndReviews,
		instructor,
		studentsEnrolled,
		createdAt,
	} = courseData.data;

	return (
		<>
			<div className={`relative bg-richblack-800`}>
				{/* Hero Section */}
				<div className="w-11/12 mx-auto max-w-maxContent">
					<div className="mx-auto px-4 lg:w-[1260px] 2xl:relative">
						<div className="mx-auto grid min-h-[450px] max-w-maxContent justify-items-center py-8 lg:mx-0 lg:justify-items-start lg:py-0 xl:max-w-[810px]">
							<div className="relative block max-h-120 lg:hidden">
								<div className="absolute bottom-0 left-0 h-full w-full shadow-[#161D29_0px_-64px_36px_-28px_inset]"></div>
								<img src={thumbnail} alt="course thumbnail" className="aspect-auto w-full" />
							</div>
							<div
								className={`z-30 my-5 flex flex-col justify-center gap-4 py-5 text-lg text-richblack-5`}
							>
								<div>
									<p className="text-4xl font-bold text-richblack-5 sm:text-[42px]">
										{courseName}
									</p>
								</div>
								<p className={`text-richblack-200`}>{courseDescription}</p>
								<div className="text-md flex flex-wrap items-center gap-2">
									<span className="text-yellow-25">{avgRatingCount}</span>
									<RatingStars Review_Count={avgRatingCount} Star_Size={24} />
									<span>{`(${ratingAndReviews.length} reviews)`}</span>
									<span>{`${studentsEnrolled.length} students enrolled`}</span>
								</div>
								<div>
									<p className="">
										Created By {`${instructor.firstName} ${instructor.lastName}`}
									</p>
								</div>
								<div className="flex flex-wrap gap-5 text-lg">
									<p className="flex items-center gap-2">
										{' '}
										<BiInfoCircle /> Created at {formattedDate(createdAt)}
									</p>
									<p className="flex items-center gap-2">
										{' '}
										<CiGlobe /> English
									</p>
								</div>
							</div>
							<div className="flex w-full flex-col gap-4 border-y border-y-richblack-500 py-4 lg:hidden">
								<p className="space-x-3 pb-4 text-3xl font-semibold text-richblack-5">
									Rs. {price}
								</p>
								<button className="yellowButton" onClick={handleBuyCourse}>
									Buy Now
								</button>
								<button className="blackButton">Add to Cart</button>
							</div>
						</div>
						{/* Courses Card */}
						<div className="right-4 top-[60px] mx-auto hidden w-1/3 max-w-[410px] translate-y-24 md:translate-y-0 lg:absolute lg:block">
							<CourseDetailsCard
								course={courseData?.data}
								setConfirmationModal={setConfirmationModal}
								handleBuyCourse={handleBuyCourse}
							/>
						</div>
					</div>
				</div>
			</div>
			<div className="mx-auto box-content px-4 text-start text-richblack-5 lg:w-[1260px]">
				<div className="mx-auto max-w-maxContentTab lg:mx-0 xl:max-w-[810px]">
					{/* What will you learn section */}
					<div className="my-8 border border-richblack-600 p-8">
						<p className="text-3xl font-semibold">What you'll learn</p>
						<div className="mt-5">
							<ReactMarkDown>{whatYouWillLearn}</ReactMarkDown>
						</div>
					</div>

					{/* Course Content Section */}
					<div className="max-w-[830px] ">
						<div className="flex flex-col gap-3">
							<p className="text-[28px] font-semibold">Course Content</p>
							<div className="flex flex-wrap justify-between gap-2">
								<div className="flex gap-2">
									<span>
										{courseContent.length} {`section(s)`}
									</span>
									<span>
										{totalNoOfLectures} {`lecture(s)`}
									</span>
									<span>{courseData.data?.timeDuration} total length</span>
								</div>
								<div>
									<button className="text-yellow-25" onClick={() => setIsActive([])}>
										Collapse all sections
									</button>
								</div>
							</div>
						</div>

						{/* Course Details Accordion */}
						<div className="py-4">
							{courseContent?.map((course, index) => (
								<CourseAccordionBar
									course={course}
									key={index}
									isActive={isActive}
									handleActive={handleActive}
								/>
							))}
						</div>

						{/* Author Details */}
						<div className="mb-12 py-4">
							<p className="text-[28px] font-semibold">Author</p>
							<div className="flex items-center gap-4 py-4">
								<img
									src={
										instructor.image
											? instructor.image
											: `https://api.dicebear.com/5.x/initials/svg?seed=${instructor.firstName} ${instructor.lastName}`
									}
									alt="Author"
									className="h-14 w-14 rounded-full object-cover"
								/>
								<p className="text-lg">{`${instructor.firstName} ${instructor.lastName}`}</p>
							</div>
							<p className="text-richblack-50">{instructor?.additionalDetails?.about}</p>
						</div>
					</div>
				</div>
			</div>
			<Footer />
			{confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
		</>
	);
}
export default CourseDetails;
