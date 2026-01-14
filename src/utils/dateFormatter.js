function formattedDate(date) {
	const d = new Date(date);
	const formattedDate = d.toLocaleDateString('en-US', {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
	});

	return formattedDate;
}
export default formattedDate;
