import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	/* problem statement: when we login first so the user data gets store for the first time. but when we refresh 
		the page so the user gets clear from the store meaning we didnt set the user data in the localstorage.
		so we need to set the user data in the localstorage. in authApi as well here
	*/
	user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
	loading: false,
};

const profileSlice = createSlice({
	name: 'profile',
	initialState,
	reducers: {
		setUser(state, action) {
			state.user = action.payload;
		},
		setLoading(state, action) {
			state.loading = action.payload;
		},
	},
});

export const { setUser, setLoading } = profileSlice.actions;
export default profileSlice.reducer;
