import Instructor from '../../../assets/Images/Instructor.png';
import HighlightText from './HighlightText';
import CTAButton from './Button';
import { FaArrowRight } from 'react-icons/fa6';
function InstructorSection() {
	return (
		<div className="mt-12">
			<div className="flex items-center gap-10">
				<div className="w-[50%]">
					<img
						src={Instructor}
						className="object-contain border-t-8 border-l-8 border-white"
						alt="becomeaninstructorimg"
					/>
				</div>

				<div className="w-[50%] flex flex-col gap-10">
					<h2 className="text-4xl font-semibold w-[50%]">
						Become an <HighlightText text={'Instructor'} />
					</h2>

					<p className="font-medium text-base w-[90%] text-richblack-300">
						Instructors from around the world teach millions of
						students on StudyNotion. We provide the tools and skills
						to teach what you love.
					</p>

					<div className="flex gap-7">
						<CTAButton active={true} linkto={'/signup'}>
							<div className="flex items-center gap-2">
								Start teaching today
								<FaArrowRight />
							</div>
						</CTAButton>
					</div>
				</div>
			</div>
		</div>
	);
}
export default InstructorSection;
