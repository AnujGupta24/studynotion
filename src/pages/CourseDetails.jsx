function CourseDetails() {
	const handleBuyCourse = () => {
		console.log('buy course');
	};

	return (
		<div className="flex flex-col gap-4 border-y border-y-richblack-500 py-4">
			<p className="space-x-3 pb-4 text-3xl font-semibold text-richblack-5">Rs</p>
			<button className="yellowButton" onClick={handleBuyCourse}>
				Buy Now
			</button>
		</div>
	);
}
export default CourseDetails;
