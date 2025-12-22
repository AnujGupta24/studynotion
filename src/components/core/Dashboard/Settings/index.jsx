import ChangeProfilePicture from './ChangeProfilePicture';
import DeleteAccount from './DeleteAccount';
import EditProfile from './EditProfile';
import UpdatePassword from './UpdatePassword';

function Settings() {
	return (
		<div className="w-11/12 mx-auto max-w-maxContent mt-5">
			<h1 className="mb-10 text-3xl font-medium text-richblack-5">Edit Profile</h1>
			{/* Change Profile Picture */}
			<ChangeProfilePicture />
			{/* Profile */}
			<EditProfile />
			{/* Password */}
			<UpdatePassword />
			{/* Delete Account */}
			<DeleteAccount />
		</div>
	);
}
export default Settings;
