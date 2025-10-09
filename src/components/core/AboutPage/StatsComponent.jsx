function StatsComponent() {
	const stats = [
		{ count: '5k', label: 'Active Students' },
		{ count: '10+', label: 'Mentors' },
		{ count: '200+', label: 'Courses' },
		{ count: '50+', label: 'Awards' },
	];
	return (
		<section>
			<div>
				<div className="flex gap-x-5">
					{stats.map((stat, idx) => {
						return (
							<div key={idx}>
								<h1>{stat.count}</h1>
								<h2>{stat.label}</h2>
							</div>
						);
					})}{' '}
				</div>
			</div>
		</section>
	);
}
export default StatsComponent;
