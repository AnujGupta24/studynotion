import { useSelector } from 'react-redux';

import frameImg from '../../../assets/Images/frame.png';
import SignupForm from './SignupForm';
import LoginForm from './LoginForm';

function Template({ title, description1, description2, image, formType }) {
	const { loading } = useSelector((state) => state.auth);

	return (
		<div>
			{loading ? (
				<div className="loader"></div>
			) : (
				<div className="mx-auto flex w-10/12 max-w-maxContent flex-col-reverse justify-between gap-y-2 py-12 md:flex-row md:gap-y-0 md:gap-x-12">
					<div className="mx-auto w-10/12 max-w-[450px] md:mx-0">
						<h1 className="text-[1.75rem] font-semibold leading-10 text-richblack-5">{title}</h1>
						<p className="mt-4 text-[15px] leading-6">
							<span className="text-richblack-100">{description1}</span>{' '}
							<span className="font-edu-sa font-bold italic text-blue-100">{description2}</span>
						</p>
						{formType === 'signup' ? <SignupForm /> : <LoginForm />}
					</div>
					<div className="relative mx-auto w-10/12 max-w-[450px] md:mx-0">
						<img src={frameImg} alt="Pattern" width={500} height={450} loading="lazy" />
						<img
							src={image}
							alt="Students"
							width={500}
							height={450}
							loading="lazy"
							className="absolute -top-4 right-4 z-10"
						/>
					</div>
				</div>
			)}
		</div>
	);
}
export default Template;
