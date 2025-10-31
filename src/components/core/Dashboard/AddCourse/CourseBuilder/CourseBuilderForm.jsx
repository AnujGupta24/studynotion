import { useForm } from 'react-hook-form';
import IconBtn from '../../../../common/IconBtn';
import { IoAddCircleOutline } from 'react-icons/io5';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BiRightArrow } from 'react-icons/bi';
import { setCourse, setEditCourse, setStep } from '../../../../../slices/courseSlice';
import toast from 'react-hot-toast';
import { createSection, updateSection } from '../../../../../services/operations/courseDetailsAPI';
import NestedView from './NestedView';

function CourseBuilderForm() {
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm();

	const [loading, setLoading] = useState(false);
	const [editSectionName, setEditSectionName] = useState(null);
	const { course } = useSelector((state) => state.course);
	const dispatch = useDispatch();
	const { token } = useSelector((state) => state.auth);

	// form submission
	const onSubmit = async (data) => {
		console.log('onSubmit data', data);
		setLoading(true);
		let result;

		if (editSectionName) {
			// we are editing the section name
			result = await updateSection(
				{
					sectionName: data.sectionName,
					sectionId: editSectionName,
					courseId: course._id,
				},
				token
			);
		} else {
			result = await createSection(
				{
					sectionName: data.sectionName,
					courseId: course._id,
				},
				token
			);
		}

		// update values
		if (result) {
			console.log('section result', result);
			dispatch(setCourse(result));
			setEditSectionName(null);
			setValue('sectionName', '');
		}
		setLoading(false);
	};

	const cancelEdit = () => {
		setEditSectionName(null);
		// make sure to empty the formValue as we using useForm
		setValue('sectionName', '');
	};

	const handleChangeEditSectionName = (sectionId, sectionName) => {
		if (editSectionName === sectionId) {
			cancelEdit();
			return;
		}
		setEditSectionName(sectionId);
		setValue('sectionName', sectionName);
	};

	const goBack = () => {
		dispatch(setStep(2));
		dispatch(setEditCourse(true));
	};

	const goToNext = () => {
		if (course.courseContent.length === 0) {
			toast.error('Please add at least one section');
			return;
		}
		if (course.courseContent.some((section) => section.subSection.length === 0)) {
			toast.error('Please add atleast one lecture in each section');
			return;
		}
		// everything is good
		dispatch(setStep(3));
	};

	return (
		<div className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
			<p className="text-2xl font-semibold text-richblack-5">Course Builder</p>

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				<div className="flex flex-col space-y-2">
					<label className="text-sm text-richblack-5" htmlFor="sectionName">
						Section Name<sup className="text-pink-200">*</sup>
					</label>
					<input
						type="text"
						disabled={loading}
						id="sectionName"
						{...register('sectionName', { required: true })}
						placeholder="Add a section to build your course"
						className=" p-2 text-richblack-5 bg-richblack-700 text-sm leading-6 shadow-[0px_1px_0px_0px_rgba(255,255,255,0.5)] rounded-md "
					/>
					{errors.sectionName && (
						<span className="ml-2 text-xs tracking-wide text-pink-200">Section Name is required*</span>
					)}
				</div>

				<div className="flex items-end gap-x-4">
					<IconBtn
						type="submit"
						text={editSectionName ? 'Edit Section Name' : 'Create Section'}
						outline={true}
						disabled={loading}
					>
						<IoAddCircleOutline size={20} className="text-yellow-50" />
					</IconBtn>
					{editSectionName && (
						<button
							type="button"
							onClick={cancelEdit}
							className="text-sm text-richblack-300 underline"
						>
							Cancel Edit
						</button>
					)}
				</div>
			</form>

			{/* NestedView section-Subsection */}
			{course.courseContent.length > 0 && (
				<NestedView handleChangeEditSectionName={handleChangeEditSectionName} />
			)}

			<div className="flex justify-end gap-x-3">
				<button
					onClick={goBack}
					className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
				>
					Back
				</button>
				<IconBtn disabled={loading} text="Next" onclick={goToNext}>
					<BiRightArrow size={20} />
				</IconBtn>
			</div>
		</div>
	);
}
export default CourseBuilderForm;
