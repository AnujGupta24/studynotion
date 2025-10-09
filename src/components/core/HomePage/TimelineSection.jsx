import Logo1 from '../../../assets/TimeLineLogo/Logo1.svg';
import Logo2 from '../../../assets/TimeLineLogo/Logo2.svg';
import Logo3 from '../../../assets/TimeLineLogo/Logo3.svg';
import Logo4 from '../../../assets/TimeLineLogo/Logo4.svg';
import timelineImage from '../../../assets/Images/TimelineImage.png';

function TimelineSection() {
	const timelines = [
		{
			logo: Logo1,
			heading: 'Leadership',
			description: 'Fully committed to the success company',
		},
		{
			logo: Logo2,
			heading: 'Responsibility',
			description: 'Students will always be our top priority',
		},
		{
			logo: Logo3,
			heading: 'Flexibility',
			description: 'The ability to switch is an important skill',
		},
		{
			logo: Logo4,
			heading: 'Solve the problem',
			description: 'Code your way to a solution',
		},
	];

	return (
		<div className="flex gap-15 items-center">
			{/* left */}
			<div className="w-[45%] flex flex-col gap-5">
				{timelines.map((timeline, index) => (
					<div className="flex items-center gap-4" key={index}>
						<div className="w-[50px] h-[50px] bg-white flex rounded-full justify-center items-center ">
							<img src={timeline.logo} alt="logo" />
						</div>

						<div>
							<h2 className="font-semibold text-[18px]">
								{timeline.heading}
							</h2>
							<p className="text-base">{timeline.description}</p>
						</div>
					</div>
				))}
			</div>

			{/* right */}
			<div className="relative shadow-blue-200">
				<div className="bg-neutral-50 shadow-md rounded-xl p-5">
					<img
						className="h-[450px] object-cover"
						src={timelineImage}
						alt="timeline image"
					/>
				</div>

				<div className="absolute left-[50%] translate-x-[-50%] translate-y-[-50%] bg-caribbeangreen-700 flex text-white uppercase py-10">
					<div className="flex items-center gap-5 border-r border-caribbeangreen-300 px-7">
						<p className="text-3xl font-bold">10</p>
						<p className="text-caribbeangreen-300 text-sm">
							Years of Experience
						</p>
					</div>
					<div className="flex gap-5 items-center px-7">
						<p className="text-3xl font-bold">250</p>
						<p className="text-caribbeangreen-300 text-sm">
							Types of Courses
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
export default TimelineSection;
