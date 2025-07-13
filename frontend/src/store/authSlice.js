import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    accessToken: null,
    isAuthenticated: false,
    user: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuth(state, action) {
            state.accessToken = action.payload.token;
            state.user = action.payload.user;
            state.isAuthenticated = true;
        },
        updateUser(state, action) {
            state.user = { ...state.user, ...action.payload };
        },
        logout(state) {
            state.accessToken = null;
            state.user = null;
            state.isAuthenticated = false;
        },
    },
});

export const { setAuth, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
