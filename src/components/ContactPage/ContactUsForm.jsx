import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { apiConnector } from '../../services/apiConnector';
import { contactusEndpoint } from '../../services/apis';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import countrycode from '../../data/countrycode.json';

function ContactUsForm() {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitSuccessful },
	} = useForm();

	const submitContactForm = async (data) => {
		try {
			setLoading(true);
			const toastId = toast.loading('Loading...');
			const response = await apiConnector('POST', contactusEndpoint.CONTACT_US_API, data);
			console.log('contact form response', response);
			toast.success('Thank you, we will reach you ASAP');
			setLoading(false);
			toast.dismiss(toastId);
			navigate('/');
		} catch (error) {
			toast.error(error.message);
			setLoading(false);
		}
	};

	useEffect(() => {
		if (isSubmitSuccessful) {
			reset({
				firstname: '',
				lastname: '',
				email: '',
				message: '',
				phoneNo: '',
			});
		}
	}, [reset, isSubmitSuccessful]);

	return (
		<form
			onSubmit={handleSubmit(submitContactForm)}
			className="flex flex-col gap-7 bg-richblack-800 px-7 py-14 rounded-none md:rounded-lg"
		>
			<div className="flex flex-col gap-5 lg:flex-row ">
				{/* first name */}
				<div className="flex flex-col gap-2 lg:w-[48%]">
					<label className="label-style" htmlFor="firstname">
						First Name
					</label>
					<input
						type="text"
						className="p-2 text-richblack-5 bg-richblack-700 text-sm leading-6 shadow-[0px_1px_0px_0px_rgba(255,255,255,0.5)] rounded-md"
						id="firstname"
						placeholder="Enter first name"
						{...register('firstname', { required: true })}
					/>
					{errors.firstname && (
						<span className="-mt-1 text-[12px] text-yellow-100">Please enter your name</span>
					)}
				</div>

				{/* last Name */}
				<div className="flex flex-col gap-2 lg:w-[48%]">
					<label htmlFor="lastname" className="label-style">
						Last Name
					</label>
					<input
						type="text"
						id="lastname"
						className=" p-2 text-richblack-5 bg-richblack-700 text-sm leading-6 shadow-[0px_1px_0px_0px_rgba(255,255,255,0.5)] rounded-md "
						placeholder="Enter last name"
						{...register('lastname')}
					/>
				</div>
			</div>

			{/* email */}
			<div className="flex flex-col gap-2">
				<label htmlFor="email" className="label-style">
					Email Address
				</label>
				<input
					type="email"
					name="email"
					id="email"
					placeholder="Enter email address"
					className="p-2 text-richblack-5 bg-richblack-700 text-sm leading-6 shadow-[0px_1px_0px_0px_rgba(255,255,255,0.5)] rounded-md"
					{...register('email', { required: true })}
				/>
				{errors.email && (
					<span className="-mt-1 text-[12px] text-yellow-100">Please enter your Email address.</span>
				)}
			</div>

			{/* phoneno */}
			<div className="flex flex-col gap-2">
				<label className="label-style" htmlFor="phonenumber">
					Phone Number
				</label>
				<div className="flex gap-5">
					{/* dropdown */}
					<select
						className="p-2 text-richblack-5 w-[30%] bg-richblack-700 text-sm leading-6 shadow-[0px_1px_0px_0px_rgba(255,255,255,0.5)] rounded-md "
						name="dropdown"
						id="dropdown"
						{...register('countrycode', { required: true })}
					>
						{countrycode.map((ele, i) => {
							return (
								<option key={i} value={ele.code}>
									{ele.code}- {ele.country}
								</option>
							);
						})}
					</select>

					{/* phone no field */}
					<input
						className=" p-2 w-[70%] text-richblack-5 bg-richblack-700 text-sm leading-6 shadow-[0px_1px_0px_0px_rgba(255,255,255,0.5)] rounded-md "
						type="number"
						name="phonenumber"
						placeholder="01234567890"
						{...register('phoneNo', {
							required: { value: true, message: 'Please enter your phone number' },
							maxLength: { value: 10, message: 'Invalid phone number' },
							minLength: { value: 8, message: 'Invalid phone number' },
						})}
					/>
				</div>
				{errors.phoneNo && (
					<span className="-mt-1 text-[12px] text-yellow-100">{errors.phoneNo.message}</span>
				)}
			</div>

			{/* message */}
			<div className="flex flex-col text-white gap-2">
				<label className="label-style" htmlFor="message">
					Message
				</label>
				<textarea
					name="message"
					id="message"
					placeholder="Enter your message"
					cols={30}
					rows={7}
					{...register('message', { required: true })}
					className="p-2 text-richblack-5 bg-richblack-700 text-sm leading-6 shadow-[0px_1px_0px_0px_rgba(255,255,255,0.5)] rounded-md "
				/>
				{errors.message && (
					<span className="-mt-1 text-[12px] text-yellow-100">Please enter your message.</span>
				)}
			</div>

			{/* submit button */}
			<button
				disabled={loading}
				type="submit"
				className={`rounded-md bg-yellow-50 px-6 py-3 text-center text-[13px] font-bold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] 
         ${
				!loading && 'transition-all duration-200 hover:scale-95 hover:shadow-none'
			}  disabled:bg-richblack-500 sm:text-[16px] `}
			>
				Send Message
			</button>
		</form>
	);
}
export default ContactUsForm;
