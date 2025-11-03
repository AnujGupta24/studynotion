function formattedDate(date) {
	const d = new Date(date);
	const formattedDate = d.toLocaleDateString('en-US', {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
	});

	const formattedTime = d.toLocaleTimeString('en-US', {
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: true,
	});

	return `${formattedDate} | ${formattedTime}`;
}
export default formattedDate;
