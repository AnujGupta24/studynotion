import { useEffect, useState } from 'react';
import OTPInput from 'react-otp-input';
import { useDispatch, useSelector } from 'react-redux';
import { sendOtp, signUp } from '../services/operations/authApi';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineArrowLeft } from 'react-icons/ai';

function VerifyEmail() {
	const [otp, setOtp] = useState('');
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { signupData, loading } = useSelector((state) => state.auth);

	useEffect(() => {
		// Only allow access of this route when user has filled the signup form
		if (!signupData) {
			navigate('/signup');
		}
	}, [navigate, signupData]);

	const handleVerifyAndSignup = (e) => {
		e.preventDefault();

		const { accountType, firstName, lastName, email, password, confirmPassword } = signupData;

		dispatch(signUp(accountType, firstName, lastName, email, password, confirmPassword, otp, navigate));
	};

	return (
		<div className="text-white flex justify-center items-center h-screen w-10/12 mx-auto max-w-maxContent">
			{loading ? (
				<div className="loader"></div>
			) : (
				<div className="max-w-[500px] p-4 lg:p-8">
					<h1 className="text-richblack-5 font-semibold text-[1.875rem] leading-9.5">
						Verify Your Email
					</h1>
					<p className="text-[1.125rem] leading-6.5 my-4 text-richblack-100">
						A verfication code has been sent to you. Enter the code below
					</p>

					<form onSubmit={handleVerifyAndSignup}>
						<OTPInput
							value={otp}
							onChange={setOtp}
							numInputs={6}
							renderSeparator={<span>-</span>}
							renderInput={(props) => (
								<input
									{...props}
									style={{ boxShadow: 'inset 0px -1px 0px rgba(255, 255, 255, 0.18)' }}
									className="w-12 lg:w-[60px] border-0 bg-richblack-800 rounded-lg text-richblack-5 aspect-square text-center focus:border-0 focus:outline-2 focus:outline-yellow-50"
								/>
							)}
							containerStyle={{
								justifyContent: 'space-between',
								gap: '0 6px',
							}}
						/>
						<button
							className="w-full bg-yellow-50 py-3 px-3 rounded-lg mt-6 font-medium text-richblack-900"
							type="submit"
						>
							Verfiy Email
						</button>
					</form>

					<div className="mt-6 flex items-center justify-between">
						<button>
							<Link className="flex justify-center items-center gap-2" to="/signup">
								<AiOutlineArrowLeft />
								<p className="text-richblack-5 flex items-center gap-x-2">Back to signUp</p>
							</Link>
						</button>

						<button
							className="flex items-center text-blue-100 gap-x-2"
							onClick={() => dispatch(sendOtp(signupData.email, navigate))}
						>
							Resend it
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
export default VerifyEmail;
