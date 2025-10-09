import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { resetPassword } from '../services/operations/authAPI';
import { AiFillEye, AiFillEyeInvisible, AiOutlineArrowLeft } from 'react-icons/ai';

function UpdatePassword() {
	const dispatch = useDispatch();
	const location = useLocation();

	const [formData, setFormData] = useState({
		password: '',
		confirmPassword: '',
	});

	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const { loading } = useSelector((state) => state.auth);

	const { password, confirmPassword } = formData;

	const handleOnChange = (e) => {
		setFormData((prevData) => ({
			...prevData,
			[e.target.name]: e.target.value,
		}));
	};

	const handleOnSubmit = (e) => {
		e.preventDefault();
		const token = location.pathname.split('/').at(-1);
		dispatch(resetPassword(password, confirmPassword, token));
	};

	return (
		<div className="text-white flex justify-center items-center h-screen">
			{loading ? (
				<div className="loader"></div>
			) : (
				<div className="max-w-[500px] p-4 lg:p-8">
					<h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">
						Choose new Password
					</h1>
					<p className="my-4 text-[1.125rem] leading-[1.625rem] text-richblack-100">
						Almost done, Enter your new password and you are all set.
					</p>

					<form onSubmit={handleOnSubmit}>
						<label className="relative">
							<p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
								New Password <sup className="text-pink-200">*</sup>
							</p>
							<input
								required
								type={showPassword ? 'text' : 'password'}
								placeholder="Enter new password"
								name="password"
								value={password}
								onChange={handleOnChange}
								className="mt-1 rounded-[8px] bg-richblack-800 p-[12px] w-full"
							/>
							<span
								onClick={() => setShowPassword((prev) => !prev)}
								className="absolute right-3 top-[38px] z-[10] cursor-pointer"
							>
								{showPassword ? (
									<AiFillEyeInvisible fontSize={20} fill="#AFB2BF" />
								) : (
									<AiFillEye fontSize={20} fill="#AFB2BF" />
								)}
							</span>
						</label>

						<label className="relative mt-3 block">
							<p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
								Confirm New Password <sup className="text-pink-200">*</sup>
							</p>
							<input
								required
								type={showConfirmPassword ? 'text' : 'password'}
								placeholder="confirm new password"
								name="confirmPassword"
								value={confirmPassword}
								onChange={handleOnChange}
								className="mt-1 rounded-[8px] bg-richblack-800 p-[12px] w-full"
							/>
							<span
								onClick={() => setShowConfirmPassword((prev) => !prev)}
								className="absolute right-3 top-[38px] z-[10] cursor-pointer"
							>
								{showConfirmPassword ? (
									<AiFillEyeInvisible fontSize={20} fill="#AFB2BF" />
								) : (
									<AiFillEye fontSize={20} fill="#AFB2BF" />
								)}
							</span>
						</label>

						<button
							className="mt-6 w-full rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-medium text-richblack-900"
							type="submit"
						>
							Reset Password
						</button>
					</form>

					<button className="mt-6 flex items-center justify-between">
						<Link className="flex justify-center items-center gap-2" to="/login">
							<p className="flex items-center gap-x-2 text-richblack-5">
								<AiOutlineArrowLeft /> Back to login
							</p>
						</Link>
					</button>
				</div>
			)}
		</div>
	);
}
export default UpdatePassword;
