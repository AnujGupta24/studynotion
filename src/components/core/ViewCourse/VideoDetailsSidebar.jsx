import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import IconBtn from '../../common/IconBtn';
import { IoChevronBackCircleOutline } from 'react-icons/io5';
import { BsChevronDown } from 'react-icons/bs';

function VideoDetailsSidebar({ setReviewModal }) {
	const [videobarActive, setVideobarActive] = useState('');
	const [activeStatus, setActiveStatus] = useState('');
	const { sectionId, subSectionId } = useParams();
	const navigate = useNavigate();
	const location = useLocation();
	const { courseSectionData, courseEntireData, completedLectures, totalNoOfLectures } = useSelector(
		(state) => state.viewCourse
	);

	useEffect(() => {
		const setActiveFlags = async () => {
			if (!courseSectionData.length) return;

			// use for highlighting the current video/lecture
			const currentSectionIdx = courseSectionData.findIndex((data) => data._id === sectionId);
			const currentSubSectionIdx = courseSectionData?.[currentSectionIdx]?.subSection.findIndex(
				(data) => data._id === subSectionId
			);

			// current active subSection video id for highlight
			const activeSubSectionId =
				courseSectionData[currentSectionIdx]?.subSection?.[currentSubSectionIdx]?._id;

			// set current section here
			setActiveStatus(courseSectionData?.[currentSectionIdx]?._id);
			// set current subSection here
			setVideobarActive(activeSubSectionId);
		};
		setActiveFlags();
	}, [courseSectionData, courseEntireData, sectionId, location.pathname, subSectionId]);

	return (
		<>
			<div className="flex h-[calc(100vh-3.5rem)] w-[280px] max-w-[320px] flex-col border-r border-r-richblack-700 bg-richblack-800">
				{/* for btns and headings */}
				<div className="mx-5 flex flex-col items-start justify-between gap-2 gap-y-4 border-b border-richblack-600 py-5 text-lg font-bold text-richblack-25">
					{/* for btns */}
					<div className="flex w-full items-center justify-between">
						<div
							className="flex items-center justify-center text-richblack-300 hover:scale-90"
							onClick={() => navigate('/dashboard/enrolled-courses')}
						>
							<IoChevronBackCircleOutline size={30} />
						</div>

						<IconBtn text="Add Review" onclick={() => setReviewModal(true)} />
					</div>

					{/* for heading and title */}
					<div className="flex flex-col">
						<p>{courseEntireData?.courseName}</p>
						<p className="text-sm font-semibold text-richblack-500">
							lectures {completedLectures?.length}/{totalNoOfLectures}
						</p>
					</div>
				</div>

				{/* for sections and subSections */}
				<div className="h-[calc(100vh - 5rem)] overflow-y-auto">
					{courseSectionData.map((section, idx) => (
						<div
							className="mt-2 cursor-pointer text-sm text-richblack-5"
							onClick={() => setActiveStatus(section?._id)}
							key={idx}
						>
							{/* section */}
							<div className="flex flex-row justify-between bg-richblack-600 px-5 py-4">
								<div className="w-[70%] font-semibold">{section?.sectionName}</div>
								<div className="flex items-center gap-3">
									<span
										className={`${
											activeStatus === section?.sectionName ? 'rotate-0' : 'rotate-180'
										} transition-all duration-500`}
									>
										<BsChevronDown />
									</span>
								</div>
							</div>

							{/* subSection */}
							<>
								{activeStatus === section?._id && (
									<div className="transition-[height] duration-500 ease-in-out">
										{section.subSection.map((topic, idx) => (
											<div
												className={`flex gap-3 p-3 ${
													videobarActive === topic._id
														? 'bg-yellow-200 font-semibold text-richblack-800'
														: 'hover:bg-richblack-900 text-white'
												}`}
												key={idx}
												onClick={() => {
													navigate(
														`/view-course/${courseEntireData?._id}/section/${section?._id}/sub-section/${topic?._id}`
													);
													setVideobarActive(topic?._id);
												}}
											>
												<input
													type="checkbox"
													checked={completedLectures.includes(topic?._id)}
													onChange={() => {}}
												/>
												<span>{topic.title}</span>
											</div>
										))}
									</div>
								)}
							</>
						</div>
					))}
				</div>
			</div>
		</>
	);
}
export default VideoDetailsSidebar;
