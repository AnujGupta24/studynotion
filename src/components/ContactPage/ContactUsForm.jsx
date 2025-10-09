import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

function ContactUsForm() {
	const [loading, setLoading] = useState(false);
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitSuccessful },
	} = useForm();

	const submitContactForm = async (data) => {
		console.log(data);
	};

	useEffect(() => {
		if (isSubmitSuccessful) {
			reset({
				email: '',
				firstname: '',
				lastname: '',
				message: '',
				phoneNo: '',
			});
		}
	}, [isSubmitSuccessful, reset]);

	return (
		<form onSubmit={handleSubmit(submitContactForm)} className="">
			<label htmlFor="firstname"></label>
			<p>First Name</p>
			<input
				type="text"
				name="firstname"
				id="firstName"
				placeholder="Enter your first name"
				{...register('firstname', { required: true })}
			/>
			{errors.firstname && <span className="">First name is required</span>}
		</form>
	);
}
export default ContactUsForm;
