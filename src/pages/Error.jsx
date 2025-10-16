import HighlightText from '../components/core/HomePage/HighlightText';

function Error() {
	return (
		<div className="flex items-center justify-center h-screen w-full text-4xl text-richblack-100">
			<HighlightText text={404} />
			&nbsp;Page not found
		</div>
	);
}
export default Error;
