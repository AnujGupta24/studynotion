import HighlightText from './HighlightText';
import know_your_progress from '../../../assets/Images/know_your_progress.png';
import compare_with_others from '../../../assets/Images/compare_with_others.png';
import plan_your_lessons from '../../../assets/Images/plan_your_lessons.png';
import CTAButton from '../HomePage/Button';
function LearningLanguageSection() {
	return (
		<div className="mt-[90px] mb-[100px]">
			<div className="flex flex-col items-center gap-5">
				<h2 className="text-4xl text-center font-semibold">
					Your Swiss Knife for{' '}
					<HighlightText
						text={'learn any language'}
						className="font-bold text-richblue-200"
					/>
				</h2>
				<p className="text-richblack-600 mx-auto text-center font-medium w-[70%]">
					Using spin making learning multiple languages easy. with 20+
					languages realistic voice-over, progress tracking, custom
					schedule and more.
				</p>

				<div className="flex items-center justify-center mt-3">
					<img
						src={know_your_progress}
						className="object-contain -mr-44"
						alt="knowyourprogressimage "
					/>
					<img
						src={compare_with_others}
						className="object-contain"
						alt="comparewithothersimage"
					/>
					<img
						src={plan_your_lessons}
						className="object-contain -ml-36 mb-auto "
						alt="planyourlessonsimage"
					/>
				</div>

				<div className="w-fit">
					<CTAButton active={true} linkto={'/login'}>
						Learn More
					</CTAButton>
				</div>
			</div>
		</div>
	);
}
export default LearningLanguageSection;
