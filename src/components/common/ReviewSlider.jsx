import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';

// Import required modules
import { Autoplay, FreeMode, Pagination } from 'swiper/modules';
import ReactStars from 'react-stars';
import { FaStar } from 'react-icons/fa6';
import { ratingsEndpoints } from '../../services/apis';
import { useEffect, useState } from 'react';
import { apiConnector } from '../../services/apiConnector';
import HighlightText from '../core/HomePage/HighlightText';

function ReviewSlider() {
	const [reviews, setReviews] = useState([]);
	const truncateWords = 15;

	useEffect(() => {
		const fetchAllReviews = async () => {
			const response = await apiConnector('GET', ratingsEndpoints.REVIEWS_DETAILS_API);
			// console.log('fetchAllReviews......', response);
			const { data } = response;
			// console.log('destructured data...', data);
			if (data?.success) {
				setReviews(data?.data);
			}
		};
		fetchAllReviews();
	}, []);
	// console.log('printing reviews', reviews);

	return (
		<div className="text-white w-full">
			<h2 className="text-center text-4xl font-semibold">
				<HighlightText text={'Reviews from other learners'} />
			</h2>
			<div className="my-[30px] h-[130px] lg:max-w-maxContent">
				<Swiper
					slidesPerView={4}
					spaceBetween={25}
					loop={true}
					freeMode={true}
					autoplay={{
						delay: 2500,
						disableOnInteraction: false,
					}}
					modules={[FreeMode, Pagination, Autoplay]}
				>
					{reviews.map((review, idx) => (
						<SwiperSlide key={idx}>
							<div className="flex flex-col gap-3 rounded-md bg-richblack-800 p-3 text-[14px] text-richblack-25">
								<div className="flex items-center gap-4">
									<img
										src={
											review?.user?.image
												? review?.user?.image
												: `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
										}
										alt="profile pic"
										className="h-9 w-9 rounded-full object-cover"
									/>
									<div className="flex flex-col">
										<h1 className="font-semibold text-richblack-5">
											{review?.user?.firstName} {review?.user?.lastName}
										</h1>
										<h2 className="text-[12px] font-medium text-richblack-500">
											{review?.course?.courseName}
										</h2>
									</div>
								</div>
								<p className="font-medium text-richblack-25">
									{review?.review.split(' ').length > truncateWords
										? `${review?.review.split(' ').slice(0, truncateWords).join(' ')}....`
										: `${review?.review}`}
								</p>
								<div className="flex items-center gap-2">
									<h3 className="font-semibold text-yellow-100">{review?.rating.toFixed(1)}</h3>
									<ReactStars
										count={5}
										value={review?.rating}
										size={20}
										edit={false}
										activeColor="#ffd700"
										emptyIcon={<FaStar />}
										fullIcon={<FaStar />}
									/>
								</div>
							</div>
						</SwiperSlide>
					))}
				</Swiper>
			</div>
		</div>
	);
}
export default ReviewSlider;
