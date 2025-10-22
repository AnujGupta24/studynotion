import { useDispatch, useSelector } from 'react-redux';
import { sidebarLinks } from '../../../data/dashboard-links';
import SidebarLink from './SidebarLink';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../services/operations/authAPI';
import ConfirmationModal from '../../common/ConfirmationModal';
import { GrLogout } from 'react-icons/gr';

function Sidebar() {
	const { loading: authLoading } = useSelector((state) => state.auth);
	const { user, loading: profileLoading } = useSelector((state) => state.profile);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	// to track the state of confimation modal
	const [confirmationModal, setConfirmationModal] = useState(null);

	if (authLoading || profileLoading) {
		return (
			<div className="grid h-[calc(100vh-3.5rem)] min-w-[220px] items-center border-r-[1px] border-r-richblack-700 bg-richblack-800">
				<div className="loader"></div>
			</div>
		);
	}

	return (
		<>
			<div className="flex h-[calc(100vh-3.5rem)] min-w-[220px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800 py-10">
				{/* dashboard user Links */}
				<div className="flex flex-col">
					{sidebarLinks.map((link) => {
						if (link.type && user?.accountType !== link.type) return null;
						return <SidebarLink key={link.name} link={link} iconName={link.icon} />;
					})}
				</div>

				<div className="mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-700" />

				{/* settings  */}
				<div className="flex flex-col">
					<SidebarLink
						link={{ name: 'Settings', path: '/dashboard/settings' }}
						iconName="VscSettingsGear"
					/>

					{/* logout modal */}
					<button
						className="px-8 py-2 text-sm font-medium text-richblack-300"
						onClick={() =>
							setConfirmationModal({
								text1: 'Are you sure?',
								text2: 'you will be logged out of your Account',
								btn1Text: 'Logout',
								btn2Text: 'Cancel',
								btn1Handler: () => dispatch(logout(navigate)),
								btn2Handler: () => setConfirmationModal(null),
							})
						}
					>
						<div className="flex items-center gap-x-2">
							<GrLogout className="text-lg" />
							<span>Logout</span>
						</div>
					</button>
				</div>
			</div>

			{/* confirmation modal */}
			{confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
		</>
	);
}
export default Sidebar;
