import { useEffect, useState } from 'react';

function RequirementField({ name, label, register, errors, setValue }) {
	const [requirement, setRequirement] = useState('');
	const [requirementList, setRequirementList] = useState([]);

	// register on first render
	useEffect(() => {
		register(name, {
			required: true,
			validate: (value) => value.length > 0,
		});
	}, [name, register]);

	// i have a problem to understand this
	useEffect(() => {
		setValue(name, requirementList);
	}, [requirementList, name, setValue]);

	const handleAddRequirement = () => {
		if (requirement) {
			setRequirementList([...requirementList, requirement]);
			setRequirement('');
		}
	};

	const handleRemoveRequirement = (index) => {
		const updatedRequirementList = requirementList.filter((_, i) => i !== index);
		setRequirementList(updatedRequirementList);
	};

	return (
		<div className="flex flex-col space-y-2">
			<label className="text-sm text-richblack-5" htmlFor={name}>
				{label} <sup className="text-pink-200">*</sup>
			</label>
			<div className="flex flex-col items-start space-y-2">
				<input
					type="text"
					id={name}
					value={requirement}
					onChange={(e) => setRequirement(e.target.value)}
					className="w-full p-2 text-richblack-5 bg-richblack-700 text-sm leading-6 shadow-[0px_1px_0px_0px_rgba(255,255,255,0.5)] rounded-md "
				/>
				<button type="button" onClick={handleAddRequirement} className="font-semibold text-yellow-50">
					Add
				</button>
			</div>

			{requirementList.length > 0 && (
				<ul className="mt-2 list-inside list-disc">
					{requirementList.map((requirement, index) => (
						<li key={index} className="flex items-center text-richblack-5">
							<span>{requirement}</span>
							<button
								type="button"
								className="ml-2 text-xs text-pure-greys-300"
								onClick={() => handleRemoveRequirement(index)}
							>
								clear
							</button>
						</li>
					))}
				</ul>
			)}
			{errors[name] && (
				<span className="ml-2 text-xs tracking-wide text-pink-200">{label} is required*</span>
			)}
		</div>
	);
}
export default RequirementField;
