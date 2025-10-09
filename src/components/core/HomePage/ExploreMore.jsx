import { useState } from 'react';
import { HomePageExplore } from '../../../data/homepage-explore';
import HighlightText from './HighlightText';
import CourseCard from './CourseCard';

function ExploreMore() {
	const tabsName = [
		'Free',
		'New to coding',
		'Most popular',
		'Skill paths',
		'Career paths',
	];

	const [currentTab, setCurrentTab] = useState(tabsName[0]);
	const [courses, setCourses] = useState(HomePageExplore[0].courses);
	const [currentCard, setCurrentCard] = useState(
		HomePageExplore[0].courses[0].heading
	);

	const setMyCards = (value) => {
		setCurrentTab(value);
		const result = HomePageExplore.filter((course) => course.tag === value);
		setCourses(result[0].courses);
		setCurrentCard(result[0].courses[0].heading);
	};

	return (
		<div>
			<div className="text-4xl text-center font-semibold ">
				Unlock the <HighlightText text={'Power of Code'} />
			</div>
			<p className="text-center text-richblack-300 text-sm text-[16px] mt-3 ">
				Learn to build anything you imagine
			</p>
			<div className="mt-5 flex flex-row rounded-full bg-richblack-800 mb-5 border-richblack-100 px-1 py-1 ">
				{tabsName.map((tab, index) => {
					return (
						<div
							className={`text-[16px] flex flex-row items-center gap-2 ${
								currentTab === tab
									? 'bg-richblack-900 text-richblack-5 font-medium'
									: 'text-richblack-200'
							} 
                  rounded-full transition-all duration-200 cursor-pointer hover:bg-richblack-900 hover:text-richblack-5 px-4 py-2`}
							key={index}
							onClick={() => setMyCards(tab)}
						>
							{tab}
						</div>
					);
				})}
			</div>
			<div className="lg:h-[120px] relative"></div>
			{/* course cards */}
			<div className="absolute top-[95%] left-[0%] flex flex-row gap-5 justify-between">
				{courses.map((course, idx) => {
					return (
						<CourseCard
							key={idx}
							cardData={course}
							currentCard={currentCard}
							setCurrentCard={setCurrentCard}
						/>
					);
				})}
			</div>
		</div>
	);
}
export default ExploreMore;
