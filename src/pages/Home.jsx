import { FaArrowRight } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import HighlightText from '../components/core/HomePage/HighlightText';
import CTAButton from '../components/core/HomePage/Button';
import Banner from '../assets/Images/banner.mp4';
import CodeBlocks from '../components/core/HomePage/CodeBlocks';
import LearningLanguageSection from '../components/core/HomePage/LearningLanguageSection';
import TimelineSection from '../components/core/HomePage/TimelineSection';
import InstructorSection from '../components/core/HomePage/InstructorSection';
import Footer from '../components/common/Footer';
import ExploreMore from '../components/core/HomePage/ExploreMore';

function Home() {
	return (
		<>
			{/* section1 */}
			<div className="relative mx-auto flex flex-col w-10/12 max-w-maxContent text-white items-center justify-between">
				<Link to={'/signup'}>
					<div className="group mt-5 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all duration-200 hover:scale-95 w-fit">
						<button className="flex items-center gap-2 cursor-pointer rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900">
							<p>Become an Instructor</p>
							<FaArrowRight />
						</button>
					</div>
				</Link>

				<p className="text-center text-4xl font-semibold mt-7">
					Empower Your Future with <HighlightText text={'Coding Skills'} />
				</p>

				<p className="mt-4 w-[86%] text-center text-lg font-bold text-richblack-300">
					with our online coding courses, you can learn at your own pace, from anywhere in the world, and
					get access to a wealth of resources, including hands-on projects, quizzes, and personalized
					feedback from instructors.
				</p>

				<div className="flex gap-7 mt-8">
					<CTAButton active={true} linkto={'/signup'}>
						Learn More
					</CTAButton>
					<CTAButton active={false} linkto={'/login'}>
						Book a Demo
					</CTAButton>
				</div>

				{/* video */}
				<div className="my-12 mx-auto w-[90%] shadow-blue-200">
					<video muted autoPlay loop>
						<source src={Banner} type="video/mp4" />
					</video>
				</div>

				{/* code section1 */}
				<div>
					<CodeBlocks
						position={'lg:flex-row'}
						heading={
							<h1 className="text-4xl font-semibold">
								Unlock Your <HighlightText text={'coding Potential'} /> with our online courses
							</h1>
						}
						subheading={
							'Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you.'
						}
						ctabtn1={{
							btnText: 'Try it yourself',
							linkto: '/signup',
							active: true,
						}}
						ctabtn2={{
							btnText: 'Learn More',
							linkto: '/login',
							active: false,
						}}
						codeblock={`<!DOCTYPE html>\n<html>\n<head><title>Example</title><linkrel="stylesheet"href="styles.css">\n</head>\n<body>\n<h1><ahref="/">Header</a></h1>\n<nav><ahref="one/">One</a><ahref="two/">Two</a><ahref="three/">Three</a></>`}
						codeColor={'text-blue-100'}
						backgroundGradient={'bg-gradient-to-r from-slate-900 to-slate-700'}
					/>
				</div>

				{/* code section2 */}
				<div>
					<CodeBlocks
						position={'lg:flex-row-reverse'}
						heading={
							<h1 className="text-4xl font-semibold">
								Start{' '}
								<HighlightText
									text={
										<span>
											Coding <br />
											in seconds
										</span>
									}
								/>
							</h1>
						}
						subheading={`Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson.`}
						ctabtn1={{
							btnText: 'Continue Lesson',
							linkto: '/signup',
							active: true,
						}}
						ctabtn2={{
							btnText: 'Learn More',
							linkto: '/login',
							active: false,
						}}
						codeblock={`<!DOCTYPE html>\n<html>\n<head><title>Example</title><linkrel="stylesheet"href="styles.css">\n</head>\n<body>\n<h1><ahref="/">Header</a></h1>\n<nav><ahref="one/">One</a><ahref="two/">Two</a><ahref="three/">Three</a><//>`}
						codeColor={'text-blue-100'}
						backgroundGradient={'bg-gradient-to-l from-slate-900 to-slate-700'}
					/>
				</div>

				{/* unlock the power section */}
				<ExploreMore />
			</div>

			{/* section2 */}
			<div className="bg-pure-greys-5 text-richblack-700">
				<div className="homepage_bg h-[310px]">
					<div className="w-10/12 flex flex-col items-center justify-between gap-5 mx-auto">
						<div className="h-[150px]"></div>
						<div className="flex gap-7 text-white">
							<CTAButton active={true} linkto={'/signup'}>
								<div className="flex gap-3 items-center">
									Explore Full Catalog
									<FaArrowRight />
								</div>
							</CTAButton>
							<CTAButton active={false} linkto={'/login'}>
								Learn More
							</CTAButton>
						</div>
					</div>
				</div>

				<div className="w-10/12 flex flex-col items-center justify-between gap-7 mx-auto">
					<div className="flex flex-row gap-5 mb-10 mt-10">
						<div className="text-4xl w-[45%] font-semibold">
							Get the Skills you need for a <HighlightText text={'Job that is in demand'} />
						</div>

						<div className="flex flex-col gap-10 items-start w-[45%]">
							<p className="text-[16px]">
								The modern StudyNotion is the dictates its own terms. Today, to be a competitive
								specialist requires more than professional skills.
							</p>
							<CTAButton active={true} linkto={'/signup'}>
								Learn More
							</CTAButton>
						</div>
					</div>

					<TimelineSection />

					<LearningLanguageSection />
				</div>
			</div>

			{/* section3 */}
			<div className="w-10/12 max-w-maxContent flex flex-col items-center justify-between gap-7 mx-auto bg-richblack-900 text-white">
				<InstructorSection />

				<h2 className="text-center text-4xl font-semibold mt-5">reviews from other learners</h2>

				{/* reviewsSider */}
			</div>

			{/* footer  */}
			<Footer />
		</>
	);
}
export default Home;
