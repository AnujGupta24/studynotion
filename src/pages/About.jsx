import HighlightText from '../components/core/HomePage/HighlightText';
import BannerImage1 from '../assets/Images/aboutus1.webp';
import BannerImage2 from '../assets/Images/aboutus2.webp';
import BannerImage3 from '../assets/Images/aboutus3.webp';
import Quote from '../components/core/AboutPage/Quote';
import FoundingStory from '../assets/Images/FoundingStory.png';
import StatsComponent from '../components/core/AboutPage/StatsComponent';
import LearningGrid from '../components/core/AboutPage/LearningGrid';
import Footer from '../components/common/Footer';
import ContactFormSection from '../components/core/AboutPage/ContactFormSection';

function About() {
	return (
		<div>
			{/* section1 */}
			<section className="bg-gray-700">
				<div className="relative mx-auto flex w-10/12 max-w-maxContent flex-col justify-between gap-20 text-center text-richblack-5">
					<header className="mx-auto py-10 text-4xl font-semibold lg:w-[70%]">
						Driving Innovation in Online Education for a <HighlightText text={'Brighter Future'} />
						<p className="mx-auto mt-5 text-center text-base font-medium text-richblack-200 lg:w-[95%]">
							Studynotion is at the forefront of driving innovation in online education. We're
							passionate about creating a brighter future by offering cutting-edge courses,
							leveraging emerging technologies, and nurturing a vibrant learning community.
						</p>
					</header>
					<div className="sm:h-[70px] lg:h-[150px]"></div>
					<div className="absolute bottom-0 left-[50%] grid w-full translate-x-[-50%] translate-y-[30%] grid-cols-3 gap-3 lg:gap-5">
						<img src={BannerImage1} />
						<img src={BannerImage2} />
						<img src={BannerImage3} />
					</div>
				</div>
			</section>

			{/* section2 */}
			<section className="border-b border-richblack-700">
				<div className="mx-auto flex w-10/12 max-w-maxContent flex-col justify-between gap-10 text-richblack-300">
					<div className="h-[100px]"></div>
					<Quote />
				</div>
			</section>

			{/* section3 */}
			<section>
				<div className="mx-auto flex w-10/12 max-w-maxContent flex-col justify-between gap-10">
					{/* founding story waala div */}
					<div className="flex flex-col items-center gap-10 lg:flex-row justify-between">
						{/* left box */}
						<div className="my-16 flex lg:w-[50%] flex-col gap-10">
							<h2 className="bg-linear-to-b from-[#FF512F] to-[#F09819] bg-clip-text text-4xl font-semibold text-transparent lg:w-[70%] ">
								Our Founding Story
							</h2>
							<p className="text-base font-medium text-richblack-300 lg:w-[95%]">
								Our e-learning platform was born out of a shared vision and passion for
								transforming education. It all began with a group of educators, technologies, and
								lifelong learners who recognized the need for accessible, flexible, and
								high-quality learning opportunities in a rapidly evolving digital world.
							</p>
							<p className="text-base font-medium text-richblack-300 lg:w-[95%]">
								As experienced educators ourselves, we witnessed firsthand the limitations and
								challenges of traditional education systems. We believed that education should not
								be confined to the walls of a classroom or restricted by geographical boundaries.
								We envisioned a platform that could bridge these gaps and empower individuals from
								all walks of life to unlock their full potential.
							</p>
						</div>
						{/* right box */}
						<div>
							<img className="shadow-[0_0_20px_0] shadow-[#FC6767]" src={FoundingStory} />
						</div>
					</div>

					{/* vison mission div */}
					<div className="flex flex-col items-center lg:flex-row justify-between">
						{/* left box */}
						<div className="mb-12 flex lg:w-[40%] flex-col gap-10">
							<h2 className="bg-linear-to-b from-[#FF512F] to-[#F09819] bg-clip-text text-4xl font-semibold text-transparent lg:w-[70%]">
								<HighlightText text={'Our Vision'} />
							</h2>
							<p className="text-base font-medium text-richblack-300 lg:w-[95%]">
								With this vision in mind, we set out on a journey to create an e-learning platform
								that would revolutionize the way people learn. Our team of dedicated experts worked
								tirelessly to develop a robust and intuitive platform that combines cutting-edge
								technology with engaging content, fostering a dynamic and interactive learning
								experience.
							</p>
						</div>
						{/* right box */}b
						<div className="mb-24 flex lg:w-[40%] flex-col gap-5">
							<h2 className="bg-linear-to-b from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] text-transparent bg-clip-text text-4xl font-semibold lg:w-[70%] ">
								<HighlightText text={'Our Mission'} />
							</h2>
							<p className="text-base font-medium text-richblack-300 lg:w-[95%]">
								Our mission goes beyond just delivering courses online. We wanted to create a
								vibrant community of learners, where individuals can connect, collaborate, and
								learn from one another. We believe that knowledge thrives in an environment of
								sharing and dialogue, and we foster this spirit of collaboration through forums,
								live sessions, and networking opportunities.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* section4 */}
			<section className="mx-auto flex bg-richblack-600 flex-col items-center justify-between mb-20">
				<StatsComponent />
			</section>

			{/* section5 */}
			<section className="mx-auto flex w-10/12 flex-col items-center justify-between max-w-maxContent mb-20">
				<LearningGrid />
				<ContactFormSection />
			</section>

			{/* ReviewSlider */}
			<section>
				<div>review from other learners</div>
			</section>

			<Footer />
		</div>
	);
}
export default About;
