import { useState } from 'react';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getPasswordResetToken } from '../services/operations/authAPI';

function ForgotPassword() {
	const [emailSent, setEmailSent] = useState(false);
	const [email, setEmail] = useState('');
	const { loading } = useSelector((state) => state.auth);
	const dispatch = useDispatch();

	const handleOnSubmit = (e) => {
		e.preventDefault();
		dispatch(getPasswordResetToken(email, setEmailSent));
		setEmailSent(true);
	};

	return (
		<div className="text-white flex justify-center items-center max-w-maxContent mx-auto w-10/12 h-screen">
			{loading ? (
				<div className="loader"></div>
			) : (
				<div className="max-w-[500px] p-4 lg:p-8">
					<h1 className="text-[1.875rem] font-semibold leading-9.5 text-richblack-5">
						{!emailSent ? 'Reset Your Password' : 'Check Your Email'}
					</h1>

					<p className="my-4 text-[1.125rem] leading-6.5 text-richblack-100">
						{!emailSent
							? 'Have no fear. we will email you a link to reset your password'
							: `we have sent the reset password link to ${email}`}
					</p>

					<form onSubmit={handleOnSubmit}>
						{!emailSent && (
							<label className="w-full">
								<p className="mb-1 text-[0.875rem] leading-5.5 text-richblack-5">
									Email Address <sup className="text-pink-200">*</sup>
								</p>
								<input
									required
									type="email"
									name="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="Enter Your Email Address"
									className="form-style w-full"
								/>
							</label>
						)}

						<button
							className="mt-6 w-full rounded-lg bg-yellow-50 py-3 px-3 font-medium text-richblack-900"
							type="submit"
						>
							{!emailSent ? 'Reset Password' : 'Resend Email'}
						</button>
					</form>

					<button>
						<Link className="flex justify-center items-center gap-2" to="/login">
							<AiOutlineArrowLeft />
							<p>Back to login</p>
						</Link>
					</button>
				</div>
			)}
		</div>
	);
}
export default ForgotPassword;
