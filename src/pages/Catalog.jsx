import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { apiConnector } from '../services/apiConnector';
import { categories } from '../services/apis';
import { getCatalogPageData } from '../services/operations/PageAndComponentData';
import CourseSlider from '../components/core/Catalog/CourseSlider';
import CourseCard from '../components/core/Catalog/CourseCard';
import Error from './Error';
import Footer from '../components/common/Footer';

function Catalog() {
	const { loading } = useSelector((state) => state.profile);
	const { catalogName } = useParams();
	const [active, setActive] = useState(1);
	const [catalogPageData, setCatalogPageData] = useState(null);
	const [categoryId, setCategoryId] = useState('');

	console.log('catalogName', catalogName);

	// fetch all categories
	useEffect(() => {
		const getCategories = async () => {
			try {
				const response = await apiConnector('GET', categories.CATEGORIES_API);

				// find out category id which is currently selected
				const category_id = response?.data?.data?.filter(
					(category) => category.name.split(' ').join('-').toLowerCase() === catalogName
				)[0]._id;
				// console.log('selected category_Id.......', category_id);

				setCategoryId(category_id);
			} catch (error) {
				console.log('Could not fetch Categories.', error);
			}
		};

		getCategories();
		// runs whenever param values changes
	}, [catalogName]);

	// fetch singlecategory details
	useEffect(() => {
		// if categoryid exists then only call getCatalogPageData api
		if (categoryId) {
			const getCategoryDetails = async () => {
				try {
					const response = await getCatalogPageData(categoryId);
					console.log('getCatalogPageData response.......', response);
					setCatalogPageData(response);
				} catch (error) {
					console.log('frontend', error);
				}
			};

			getCategoryDetails();
		}
	}, [categoryId]);

	useEffect(() => {
		console.log('CategoryId:', categoryId);
		console.log('Catalog Page Data:', catalogPageData);
		console.log('Selected Category Courses:', catalogPageData?.data?.selectedCategory?.courses);
		console.log('Different Category Courses:', catalogPageData?.data?.differentCategory?.courses);
	}, [catalogPageData, categoryId]);

	if (loading || !catalogPageData) {
		return (
			<div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
				<div className="loader"></div>
			</div>
		);
	}
	if (!loading && !catalogPageData.success) {
		return <Error />;
	}

	return (
		<>
			{/* Hero Section */}
			<div className=" box-content bg-richblack-800 px-4">
				<div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent ">
					<p className="text-sm text-richblack-300">
						{`Home / Catalog / `}
						<span className="text-yellow-25">{catalogPageData?.data?.selectedCategory?.name}</span>
					</p>
					<p className="text-3xl text-richblack-5">{catalogPageData?.data?.selectedCategory?.name}</p>
					<p className="max-w-[870px] text-richblack-200">
						{catalogPageData?.data?.selectedCategory?.description}
					</p>
				</div>
			</div>

			{/* Section 1 */}
			<div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
				<p className="text-4xl font-bold text-richblack-5">Courses to get you started</p>
				<div className="my-4 flex border-b border-b-richblack-600 text-sm">
					<p
						className={`px-4 py-2 ${
							active === 1 ? 'border-b border-b-yellow-25 text-yellow-25' : 'text-richblack-50'
						} cursor-pointer`}
						onClick={() => setActive(1)}
					>
						Most Popular
					</p>
					<p
						className={`px-4 py-2 ${
							active === 2 ? 'border-b border-b-yellow-25 text-yellow-25' : 'text-richblack-50'
						} cursor-pointer`}
						onClick={() => setActive(2)}
					>
						New
					</p>
				</div>

				<div>
					<CourseSlider Courses={catalogPageData?.data?.selectedCategory?.courses} />
				</div>
			</div>

			{/* Section 2 */}
			<div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
				<p className="text-4xl font-bold text-richblack-5">
					Top courses in {catalogPageData?.data?.selectedCategory?.name}
				</p>
				<div className="py-8">
					<CourseSlider Courses={catalogPageData?.data?.differentCategory?.courses} />
					{console.log('courseSlider', catalogPageData?.data?.differentCategory?.courses)}
				</div>
			</div>

			{/* Section 3 */}
			<div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
				<div className="text-4xl font-bold text-richblack-5">Frequently Bought</div>
				<div className="py-8 ">
					<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
						{catalogPageData?.data?.mostSellingCourses?.slice(0, 4).map((course, i) => (
							<CourseCard course={course} key={i} Height={'h-[400px]'} />
						))}
					</div>
				</div>
			</div>

			<Footer />
		</>
	);
}
export default Catalog;
