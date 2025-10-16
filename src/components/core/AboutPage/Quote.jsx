import HighlightText from '../HomePage/HighlightText';

function Quote() {
	return (
		<div className="text-xl md:text-3xl font-semibold mx-auto py-10 pb-10 text-center text-white">
			We are passionate about revolutionizing the way we learn. Our innovative platform
			<HighlightText text={'combines technology'} />
			<span className="bg-gradient-to-b from-[#FF512F] to-[#F09819] bg-clip-text font-semibold text-transparent">
				{' '}
				expertise
			</span>
			, and community to create an
			<span className="bg-gradient-to-b from-[#FF512F] to-[#F09819] bg-clip-text font-semibold text-transparent">
				{' '}
				unparalleled educational experience.
			</span>
		</div>
	);
}
export default Quote;
