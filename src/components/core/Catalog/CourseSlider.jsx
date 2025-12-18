import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';

// Import required modules
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import CourseCard from './CourseCard';

function CourseSlider({ Courses }) {
	return (
		<>
			{Courses?.length ? (
				<Swiper
					slidesPerView={1}
					spaceBetween={25}
					pagination={true}
					loop={true}
					modules={[Autoplay, Pagination, Navigation]}
					autoplay={{ delay: 1000, disableOnInteraction: false }}
					navigation={true}
					breakpoints={{
						1024: { slidesPerView: 3 },
					}}
					className="max-h-120"
				>
					{Courses?.map((course, i) => (
						<SwiperSlide key={i}>
							<CourseCard course={course} Height={'h-[250px]'} />
						</SwiperSlide>
					))}
				</Swiper>
			) : (
				<p className="text-xl text-richblack-5">No Course Found</p>
			)}
		</>
	);
}
export default CourseSlider;
