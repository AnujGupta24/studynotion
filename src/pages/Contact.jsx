import Footer from '../components/common/Footer';
import ReviewSlider from '../components/common/ReviewSlider';
import ContactDetails from '../components/ContactPage/ContactDetails';
import ContactForm from '../components/ContactPage/ContactForm';

function Contact() {
	return (
		<div>
			<div className="mx-auto mt-10 flex w-10/12 max-w-maxContent flex-col justify-between gap-5 text-white lg:flex-row">
				{/* Contact Details */}
				<div className="lg:w-[40%]">
					<ContactDetails />
				</div>

				{/* Contact Form */}
				<div className="lg:w-[60%]">
					<ContactForm />
				</div>
			</div>

			<div className="relative mx-auto my-10 flex w-10/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
				{/* <ReviewSlider /> */}
				<ReviewSlider />
			</div>
			<Footer />
		</div>
	);
}
export default Contact;
