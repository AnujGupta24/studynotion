function StatsComponent() {
	const stats = [
		{ count: '5k', label: 'Active Students' },
		{ count: '10+', label: 'Mentors' },
		{ count: '200+', label: 'Courses' },
		{ count: '50+', label: 'Awards' },
	];
	return (
		<section>
			<div className="flex w-full justify-between px-4 py-8 lg:py-14 lg:px-12 2xl:px-16 gap-6 lg:gap-20		">
				{stats.map((stat, idx) => {
					return (
						<div className="text-richblack-50 flex flex-col justify-center items-center" key={idx}>
							<h1 className="text-5xl font-bold ">{stat.count}</h1>
							<h2 className="text-lg font-semibold">{stat.label}</h2>
						</div>
					);
				})}
			</div>
		</section>
	);
}
export default StatsComponent;
