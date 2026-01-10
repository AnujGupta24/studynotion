import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { markLectureAsComplete } from '../../../services/operations/courseDetailsAPI';
import { updateCompletedLectures } from '../../../slices/viewCourseSlice';
import ReactPlayer from 'react-player';
import IconBtn from '../../common/IconBtn';

function VideoDetails() {
	const { courseId, sectionId, subSectionId } = useParams();
	const navigate = useNavigate();
	const location = useLocation();
	const playerRef = useRef(null);
	const dispatch = useDispatch();
	const { token } = useSelector((state) => state.auth);
	const { courseSectionData, courseEntireData, completedLectures } = useSelector((state) => state.viewCourse);

	const [videoData, setVideoData] = useState([]);
	const [videoEnded, setVideoEnded] = useState(false);
	const [previewSource, setPreviewSource] = useState('');
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const setVideoSpecificDetails = async () => {
			if (!courseSectionData.length) return;

			if (!courseId && !sectionId && !subSectionId) {
				navigate('/dashboard/enrolled-courses');
			} else {
				// lets assume all 3 fields are present
				const filteredData = courseSectionData.filter((course) => course._id === sectionId);
				const filteredVideoData = filteredData?.[0].subSection.filter((data) => data._id === subSectionId);
				setVideoData(filteredVideoData[0]);
				setPreviewSource(courseEntireData.thumbnail);
				setVideoEnded(false);
			}
		};
		setVideoSpecificDetails();
	}, [courseSectionData, courseEntireData, location.pathname, courseId, sectionId, subSectionId, navigate]);

	const isFirstVideo = () => {
		// find current sec idx
		const currentSectionIdx = courseSectionData.findIndex((data) => data._id === sectionId);
		// find current sub sec idx
		const currentSubSectionIdx = courseSectionData[currentSectionIdx].subSection.findIndex(
			(data) => data._id === subSectionId
		);

		// check both is 0
		if (currentSectionIdx === 0 && currentSubSectionIdx === 0) {
			return true;
		} else {
			return false;
		}
	};

	const isLastVideo = () => {
		const currentSectionIdx = courseSectionData.findIndex((data) => data._id === sectionId);
		const noOfSubSections = courseSectionData[currentSectionIdx].subSection.length;
		const currentSubSectionIdx = courseSectionData[currentSectionIdx].subSection.findIndex(
			(data) => data._id === subSectionId
		);

		if (currentSectionIdx === courseSectionData.length - 1 && currentSubSectionIdx === noOfSubSections - 1) {
			return true;
		} else {
			return false;
		}
	};

	const goToNextVideo = () => {
		const currentSectionIdx = courseSectionData.findIndex((data) => data._id === sectionId);
		const noOfSubSections = courseSectionData[currentSectionIdx].subSection.length;
		const currentSubSectionIdx = courseSectionData[currentSectionIdx].subSection.findIndex(
			(data) => data._id === subSectionId
		);

		if (currentSubSectionIdx !== noOfSubSections - 1) {
			// same sec next video
			const nextSubSectionId = courseSectionData[currentSectionIdx].subSection[currentSectionIdx + 1]._id;
			// go to next video
			navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`);
		} else {
			// diff sec first video
			const nextSectionId = courseSectionData[currentSectionIdx + 1]._id;
			const nextSubSectionId = courseSectionData[currentSectionIdx + 1].subSection[0]._id;
			// go to this video
			navigate(`/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`);
		}
	};

	const goToPrevVideo = () => {
		const currentSectionIdx = courseSectionData.findIndex((data) => data._id === sectionId);
		// const noOfSubSections = courseSectionData[currentSectionIdx].subSection.length;
		const currentSubSectionIdx = courseSectionData[currentSectionIdx].subSection.findIndex(
			(data) => data._id === subSectionId
		);

		if (currentSubSectionIdx !== 0) {
			// same sec prev video
			const prevSubSectionId = courseSectionData[currentSectionIdx].subSection[currentSubSectionIdx - 1];
			// go to this video
			navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`);
		} else {
			// diff sec last video
			const prevSectionId = courseSectionData[currentSectionIdx - 1]._id;
			const prevSubSectionLength = courseSectionData[currentSectionIdx - 1].subSection.length;
			const prevSubSectionId =
				courseSectionData[currentSectionIdx - 1].subSection[prevSubSectionLength - 1]._id;
			// go to this video
			navigate(`/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`);
		}
	};

	const handleLectureCompletion = async () => {
		//dummy code need to change w actaul call
		setLoading(true);
		const res = await markLectureAsComplete({ courseId: courseId, subSectionId: subSectionId }, token);
		// update state
		if (res) {
			dispatch(updateCompletedLectures(subSectionId));
		}
		setLoading(false);
	};

	return (
		<div className="flex flex-col gap-5 text-white">
			{!videoData ? (
				<img src={previewSource} alt="Preview" className="h-full w-full rounded-md object-cover" />
			) : (
				<div style={{ position: 'relative' }}>
					<ReactPlayer
						ref={playerRef}
						onEnded={() => setVideoEnded(true)}
						src={videoData?.videoUrl}
						controls
						style={{ padding: 20 }}
						width="100%"
						height="100%"
						config={{
							file: {
								attributes: {
									controlsList: 'nodownload',
									onContextMenu: (e) => e.preventDefault(),
								},
							},
						}}
					/>
					{/* <BigPlayButton position="center" /> */}

					{/* Render When Video Ends */}
					{!videoEnded && (
						<div
							style={{
								position: 'absolute',
								top: '50%',
								left: '50%',
								transform: 'translate(-50%, -50%)',
								zIndex: 10,
								color: 'white',
								fontSize: '3rem',
								pointerEvents: 'none',
							}}
						></div>
					)}
					{videoEnded && (
						// mark as complete and rewatch btn
						<div
							style={{
								backgroundImage:
									'linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1)',
							}}
							className="full absolute inset-0 z-100 grid h-full place-content-center font-inter"
						>
							{!completedLectures.includes(subSectionId) && (
								<IconBtn
									disabled={loading}
									onclick={() => handleLectureCompletion()}
									text={!loading ? 'Mark As Completed' : 'Loading...'}
									customClasses="text-xl max-w-max px-4 mx-auto"
								/>
							)}
							<IconBtn
								disabled={loading}
								onclick={() => {
									if (playerRef.current) {
										// set the current time of the video to 0
										playerRef.current?.seekTo(0, 'seconds');
										setVideoEnded(false);
									}
								}}
								text="Rewatch"
								customClasses="text-xl max-w-max px-4 mx-auto mt-2"
							/>

							{/* prev and next btn */}
							<div className="mt-10 flex min-w-[250px] justify-center gap-x-4 text-xl">
								{!isFirstVideo() && (
									<button disabled={loading} onClick={goToPrevVideo} className="blackButton">
										Prev
									</button>
								)}
								{!isLastVideo() && (
									<button disabled={loading} onClick={goToNextVideo} className="blackButton">
										Next
									</button>
								)}
							</div>
						</div>
					)}
				</div>
			)}
			<h1 className="mt-4 text-3xl font-semibold">{videoData?.title}</h1>
			<p className="pt-2 pb-6">{videoData?.description}</p>
		</div>
	);
}
export default VideoDetails;
